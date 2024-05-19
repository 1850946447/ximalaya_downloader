import {AbstractDownloader} from '#root/handler/abstractDownloader.js'
import {convertCookiesToString, addCookie} from '#root/common/utils.js'
import {decrypt} from "#root/handler/core/www2-decrypt.js"
import {log} from '#root/common/log4jscf.js'
import {buildHeaders} from '#root/common/utils.js'
import {config} from '#root/common/config.js'
import {iaxios} from '#root/common/axioscf.js'

/**
 * 网站登录类
 */
class WebSiteDownloader extends AbstractDownloader {
    constructor() {
        super('www2');
        this.clientName = "喜马拉雅网页端"
    }

    async _getQrCode() {
        return this.__getQrCode(this.clientName)
    }

    /**
     * 获取可用cookie
     * @returns {Promise<*>}
     * @private
     */
    async _getCookies() {
        const cookies = await this.__getCookieKeyValues()
        if (cookies == null) {
            return null
        }
        addCookie(cookies, '_xmLog', 'h5&85125320-3c87-43c0-8228-f43734d4bddf&2.4.15-alpha.2');
        addCookie(cookies, 'wfp', 'ACM4MzBmMDg3ODg2OTc4NmRho0-cwtmso-54bXdlYl93d3c');
        addCookie(cookies, '1&remember_me', 'y');
        addCookie(cookies, '1&_token', '38899032&6A191DC0140N5B78906E9E4535F519D5462E2F2016825D9C3950B46D77603C2B5D683A489EED120M24D4D274BD39FD6_');
        addCookie(cookies, 'xm-page-viewid', 'ximalaya-web');
        addCookie(cookies, 'impl', 'www.ximalaya.com.login');
        addCookie(cookies, 'x_xmly_traffic', 'utm_source%253A%2526utm_medium%253A%2526utm_campaign%253A%2526utm_content%253A%2526utm_term%253A%2526utm_from%253A');
        addCookie(cookies, 'Hm_lvt_4a7d8ec50cfd6af753c4f8aee3425070', '1715830002,1715931095,1716018268,1716036376');
        addCookie(cookies, 'Hm_lpvt_4a7d8ec50cfd6af753c4f8aee3425070', Math.floor(Date.now() / 1000));
        addCookie(cookies, 'web_login', Date.now());

        const result = convertCookiesToString(cookies)
        return result
    }

    /**
     * 下载音频
     * @param trackId
     * @returns {Promise<>}
     */
    async download(trackId) {
        let user = await this._getCurrentUser()
        await this._checkUser(user, true)
        const baseInfo = await this._getBaseInfo(trackId)
        const e = this._playUrl(baseInfo.playUrlList)
        const url = decrypt.getSoundCryptLink({deviceType: this.deviceType, link: e.encodeText})
        const data = await this._getAudio(url)
        return data
    }


    async _decrypt(encodeText) {
        const url = decrypt.getSoundCryptLink({deviceType: this.deviceType, link: encodeText})
        return url
    }

}


async function test() {
    const downloader = new WebSiteDownloader()
    if (!await downloader.isLogin()) {
        await downloader.login()
    }
    const album = await downloader.getAlbum(33476331)
    const trackPageResult = await downloader.getTracksList(33476331, 1, 1)
    const data = await downloader.download(trackPageResult.tracks[0].trackId)
}


test()

export {
    WebSiteDownloader
}