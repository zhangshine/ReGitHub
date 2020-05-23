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

(async function() {
    'use strict';

    const Selector = {
        IS_LOGGED_IN: 'logged-in',
        MAIN_APP: '.application-main',
        LOGIN_USER: 'meta[name=user-login]',
        REPO_LIST: '#user-repositories-list',
        PROJECT_LIST: '#projects-results',
        DASHBOARD: '#dashboard'
    };

    const CACHE_REPO_PROJECT_KEY = 'ReGitHub-Repo-Pro';

    const isLogged : boolean = $('body').hasClass(Selector.IS_LOGGED_IN);
    if(!isLogged)
        return;

    const $mainApp = $(Selector.MAIN_APP);
    if($mainApp.length <= 0)
        return;

    $('[aria-label="Explore"]', $mainApp).hide();

    const $container = $(Selector.DASHBOARD).parent();

    const previousCacheResult = localStorage.getItem(CACHE_REPO_PROJECT_KEY);
    if(previousCacheResult)
        $container.prepend(previousCacheResult);

    const userName : string = $(Selector.LOGIN_USER).attr("content");
    const reposUrl : string = `https://github.com/${userName}?tab=repositories`;
    const projectsUrl : string = `https://github.com/${userName}?tab=projects`;

    const reposHtml = await $.get(reposUrl).promise();
    const repoListHtml = $('<div />').append(reposHtml).find(Selector.REPO_LIST).html();
    const projectsHtml = await $.get(projectsUrl).promise();
    const projectListHtml = $('<div />').append(projectsHtml).find(Selector.PROJECT_LIST).parent()[0].outerHTML;
    const wholeHtml = `${projectListHtml} ${repoListHtml}`;

    if(!previousCacheResult)
        $container.prepend(wholeHtml);

    localStorage.setItem(CACHE_REPO_PROJECT_KEY, wholeHtml);
})();
