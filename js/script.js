'use strict';

const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }
    
    /* [IN PROGRESS] add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const hrefValue = clickedElement.getAttribute('href');
    console.log('hrefValue:', hrefValue);

    /* find the correct article using the selector (value of 'href' attribute) */
    const correctArticle = document.querySelector(hrefValue);
    console.log('correctArticle:', correctArticle);

    /* add class 'active' to the correct article */
    correctArticle.classList.add('active');
}

const links = document.querySelectorAll('.titles a');
for (let link of links) {
    console.log('link:', link);
    link.addEventListener('click', titleClickHandler);
}    