const functionExtractor = require('function-extractor');
const functionExtract = require('fn-extractor');
import AsyncStorage from '../async-storage';
require('fetch-everywhere');

/**
 * Extracts the stream url from youtube by downloading the
 * web page and player.
 *
 */
export class StreamUrlsStore {
  public youtubeUrl = 'https://www.youtube.com';
  public signatureFunction: Function;
  public cypher: any;
  constructor() {
  }

  async storeYoutubePlayerUrl(youtubePlayerUrl: string) {
    try {
      await AsyncStorage.setItem('youtubePlayerUrl', youtubePlayerUrl);
    } catch (error) {
    }
  }

  async storeYoutubePlayer(youtubePlayer: string) {
    try {
      await AsyncStorage.setItem('youtubePlayer', youtubePlayer);
    } catch (error) {
    }
  }

  async youtubePlayer(): Promise<string> {
    try {
      var value = await AsyncStorage.getItem('youtubePlayer');
      return value;
    } catch (error) {
      throw error;
    }
  }

  async youtubePlayerUrl(): Promise<string> {
    try {
      var value = await AsyncStorage.getItem('youtubePlayerUrl');
      return value;
    } catch (error) {
      throw error;
    }
  }

  public getVideoStreamUrl(videoId: string) {
    return fetch(`${this.youtubeUrl}/watch?v=${videoId}&gl=US&hl=en&has_verified=1&bpctr=9999999999`)
      .then(res => {
        return res.text();
      })
      .then(body => {
        return this.extractVideoInfoFromWebPage(body);
      })
      .catch(e => console.log(e));
  }

  extractVideoInfoFromWebPage(videoWebPage: any): Promise<string> {
    var res = videoWebPage.match(/;ytplayer\.config\s*=\s*({.+?});ytplayer/g);
    var jsonStringFromWeb = res[0].substring(19);
    jsonStringFromWeb = jsonStringFromWeb.substring(0, jsonStringFromWeb.length - 9);
    let json = JSON.parse(jsonStringFromWeb);
    let playerUrl = json.assets.js;
    return this.loadPlayer(playerUrl)
      .then(javascriptPlayer => {
        this.extractSignatureFunctions(javascriptPlayer);
        return this.getStreamingUrl(json.args);
      });
  }

  loadPlayer(playerUrl: string): Promise<string> {
    return this.youtubePlayerUrl()
      .then(youtubeUrl => {
        if (youtubeUrl === playerUrl) {
          return this.loadPlayerLocally();
        }
        return this.fetchPlayer(playerUrl);
      });
  }

  loadPlayerLocally(): Promise<string> {
    return this.youtubePlayer()
      .then((youtubePlayer) => youtubePlayer);
  }

  fetchPlayer(playerUrl: string): any {
    return fetch(`${this.youtubeUrl}${playerUrl}`)
      .then(res => {
        return res.text();
      })
      .then(javascriptPlayer => {
        this.storePlayerInfo(playerUrl, javascriptPlayer);
        return javascriptPlayer;
      })
      .catch(e => console.log(e));
  }

  storePlayerInfo(playerUrl: string, player: string) {
    this.storeYoutubePlayer(player);
    this.storeYoutubePlayerUrl(playerUrl);
  }

  extractSignatureFunctions(javascriptString: string) {
    let pattern = /"signature",([a-zA-Z0-9$]){2}\({1}/;
    let match = pattern.exec(javascriptString);
    let matchPattern = /,(.*)\(/;
    let functionName = matchPattern.exec(match[0])[1];
    let functions = functionExtractor.parse(javascriptString);
    let signFunc = functions.find((f: any) => functionName === f.name);
    let signatureFunctionString = javascriptString.substring(signFunc.blockStart + 1, signFunc.end - 1);
    let cypherPatternFunction = /;{1}([a-zA-Z]){2}\.{1}/;
    let matchCypher = cypherPatternFunction.exec(signatureFunctionString);
    let cypherFunctionMatch = matchCypher[0];
    let cypherFunctionName = cypherFunctionMatch.substring(1, cypherFunctionMatch.length - 1);
    let cypherFunction = this.extractCodeBetweenPatterns(`var ${cypherFunctionName}=`, ')}}', javascriptString);
    this.cypher = this.extractCypherFunctions(cypherFunction);
    signatureFunctionString = signatureFunctionString.replace(new RegExp(cypherFunctionName, 'g'), 'this.cypher');
    this.signatureFunction = new Function(signFunc.params[0].name, signatureFunctionString);
  }

  extractCypherFunctions(code: string) {
    let functions: any = {};
    let functionPattern = /([a-zA-Z]){2}:function(.*?)}{1}/gi;
    let matches = code.match(functionPattern);
    matches.forEach(match => {
      let namePattern = /([a-zA-Z]){2}:/;
      let nameMatch = namePattern.exec(match);
      let name = nameMatch[0].slice(0, -1);
      let argsPattern = /function\((.*?)\)/;
      let argsMatch = argsPattern.exec(match)[0];
      let args = argsMatch.substring(9, argsMatch.length - 1);
      let argsArr = args.split(',');
      let functionPattern = /{(.*?)}/;
      let functionMatch = functionPattern.exec(match)[0];
      let functionString = functionMatch.substring(1, functionMatch.length - 1);
      functions[name] = new Function(...argsArr, functionString);
    });
    return functions;
  }

  extractCypherFunctionName(preString: string, endString: string, code: string) {
    let preStringIndex = preString.length;
    let endStringIndexLength = endString.length;
    let endStringIndex = preStringIndex + code.substring(preStringIndex).indexOf(endString);
    return code.substring(preStringIndex, endStringIndex);
  }

  extractCodeBetweenPatterns(preString: string, endString: string, code: string) {
    let preStringIndex = code.indexOf(preString);
    let endStringIndexLength = endString.length;
    let endStringIndex = preStringIndex + endStringIndexLength + code.substring(preStringIndex).indexOf(endString);
    return code.substring(preStringIndex, endStringIndex);
  }

  getStreamingUrl(videoInfo: any) {
    let encodedFmtStreamMap = videoInfo['url_encoded_fmt_stream_map'];
    let streamInfo = encodedFmtStreamMap.split(',');
    let bestQuality = streamInfo[0];
    let streamU = this.parseData(bestQuality);
    let streamingUrl = streamU.url + '&signature=' + this.signatureFunction(streamU.s);
    return streamingUrl;
  }

  parseData(data: any) {
    var result: any = {};
    data.split('&').forEach((entry: string) => {
      result[decodeURIComponent(entry.substring(0, entry.indexOf('=')))] = decodeURIComponent(entry.substring(entry.indexOf('=') + 1));
    });
    return result;
  }

}

