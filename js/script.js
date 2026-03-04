{
'use strict';


const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }
    
    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const hrefValue = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(hrefValue);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

/* constants for options that may change */
const optArticleSelector = '.posts article',
      optTitleSelector = '.post-title',
      optTitleListSelector = '.titles';

/* Function to generate title links */
function generateTitleLinks() {

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    let html = '';
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles) {

        /* read ID and save to a constant*/
        const articleId = article.getAttribute('id');

        /* find title and save to a constant */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;

        /* create HTML link and save to a constant */
        const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;

        // /* insert the HTML link to titleList */
        // titleList.insertAdjacentHTML('beforeend', linkHTML);

        /* insert link into html variable */
        html = html + linkHTML;
    }
    /* insert the generated HTML into ul element */
    titleList.innerHTML = html;
 
    /* create a list of links by slecting a's from ul, and add event listeners */
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    } 
}

generateTitleLinks();

}