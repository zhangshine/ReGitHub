// ==UserScript==
// @name         ReGithub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com
// @grant        none
// @require      https://unpkg.com/jquery@3.5.1/dist/jquery.js
// ==/UserScript==
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    'use strict';
    return __awaiter(this, void 0, void 0, function* () {
        const Selector = {
            IS_LOGGED_IN: 'logged-in',
            MAIN_APP: '.application-main',
            LOGIN_USER: 'meta[name=user-login]',
            REPO_LIST: '#user-repositories-list',
            PROJECT_LIST: '#projects-results',
            DASHBOARD: '#dashboard'
        };
        const CACHE_REPO_PROJECT_KEY = 'ReGitHub-Repo-Pro';
        const isLogged = $('body').hasClass(Selector.IS_LOGGED_IN);
        if (!isLogged)
            return;
        const $mainApp = $(Selector.MAIN_APP);
        if ($mainApp.length <= 0)
            return;
        $('[aria-label="Explore"]', $mainApp).hide();
        const $container = $(Selector.DASHBOARD).parent();
        const previousCacheResult = localStorage.getItem(CACHE_REPO_PROJECT_KEY);
        if (previousCacheResult)
            $container.prepend(previousCacheResult);
        const userName = $(Selector.LOGIN_USER).attr("content");
        const reposUrl = `https://github.com/${userName}?tab=repositories`;
        const projectsUrl = `https://github.com/${userName}?tab=projects`;
        const reposHtml = yield $.get(reposUrl).promise();
        const repoListHtml = $('<div />').append(reposHtml).find(Selector.REPO_LIST).html();
        const projectsHtml = yield $.get(projectsUrl).promise();
        const projectListHtml = $('<div />').append(projectsHtml).find(Selector.PROJECT_LIST).parent()[0].outerHTML;
        const wholeHtml = `${projectListHtml} ${repoListHtml}`;
        if (!previousCacheResult)
            $container.prepend(wholeHtml);
        localStorage.setItem(CACHE_REPO_PROJECT_KEY, wholeHtml);
    });
})();
