(()=>{
  'use strict';

  const opts = {
    tagSizes: {
      count: 5,
      prefix: 'tag-size-',
    },
  };

  /* Convert options from opts object to selectors in select object:
  articleSelector: '.posts article', → select.all.articles
  titleSelector: '.post-title', → select.article.title
  titleListSelector: '.titles', → select.listOf.titles
  articleTagsSelector: '.post-tags .list', → select.article.tags
  articleAuthorSelector: '.posts .post-author', → select.article.author
  tagsListSelector: '.list.tags', → select.listOf.tags
  authorsListSelector: '.list.authors', → select.listOf.authors */

  const select = {
    all: {
      articles: '.post',
      linksTo: {
        tags: 'a[href^="#tag-"]', //not used in the code, but it is a selector for links to tags
        authors: 'a[href^="#author-"]', //not used in the code, but it is a selector for links to authors
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
      title: '.post-title',
    },
    listOf: {
      titles: '.titles',
      tags: '.list.tags',
      authors: '.list.authors',
    },
  };

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
  };

  /* Function to generate title links */
  function generateTitleLinks(customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';

    let html = '';

    /* for each article */
    const articles = document.querySelectorAll(select.all.articles + customSelector);
    for (let article of articles) {

      /* read ID and save to a constant*/
      const articleId = article.getAttribute('id');

      /* find title and save to a constant */
      const articleTitle = article.querySelector(select.article.title).innerHTML;

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

  /* find min and max occurances for tags */
  function calculateTagsParams(tags){

    const params = {max: 0, min: 999999};

    /* tag is the key of the tags object, tags[tag] is the value */
    for (let tag in tags) {

      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  }

  generateTitleLinks();

  /* calculate class for tag; function should return class name with size information */
  function calculateTagClass(count, params){

    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);
    return opts.tagSizes.prefix + classNumber;
  }

  function generateTags(){
    /* create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);

    /* START LOOP: for every article: */
    for (let article of articles) {

      /* find tags wrapper: 'ul' element */
      const tagsWrapper = article.querySelector(select.article.tags);

      /* declare HTML variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');

      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {

        /* generate HTML of the link */
        const linkHTML = `<li><a href="#tag-${tag}"><span>${tag}</span></a></li>`;

        /* add generated code to HTML variable */
        html = html + linkHTML;

        /* check if this link is NOT already in allTags */
        if (!allTags[tag]) {

          /* add tag to allTags object */
          allTags[tag] = 1;
        } else {
          /* if it is already in allTags object, add 1 to its counter */
          allTags[tag]++;
        }

      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;

    /* END LOOP: for every article */
    }
    /* find list of tags in right column */
    const tagList = document.querySelector(select.listOf.tags);

    const tagsParams = calculateTagsParams(allTags);

    /* create variable for all links HTML code */
    let allTagsHTML = '';

    /* START LOOP: for each tag in allTags: */
    for (let tag in allTags) {

      /* generate code of a link and add it to allTagsHTML */
      allTagsHTML += `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag],tagsParams)}"><span>${tag}</span></a></li>`;
    }
    /* END LOOP: for each tag in allTags: */

    /* add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  }
  generateTags();

  function tagClickHandler(event){

    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {

      /* remove class active */
      activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant (#tag-<tag>
    ) */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for (let tagLink of tagLinks) {

      /* add class active */
      tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument to display articles with the same tag */
    generateTitleLinks(`[data-tags~="${tag}"]`);
  }

  function addClickListenersToTags(){

    /* find all links to tags*/
    const tagsLinks = document.querySelectorAll('.post-tags a');

    /* START LOOP: for each link */
    for (let tagLink of tagsLinks) {

      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
    }
    /* END LOOP: for each link */
  }
  addClickListenersToTags();

  /*  generate authorsList in the sidebar with the number of articles */
  function generateAuthors(){

    /*  empty object for authorname and number of articles */
    const authors = {};

    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);

    /* START LOOP: for every article: */
    for (let article of articles) {

      /* find author wrapper: '.posts .post-author' */
      const authorWrapper = article.querySelector(select.article.author);

      /* get author from data-author attribute */
      const author = article.getAttribute('data-author');

      /* generate HTML of the link */
      const linkHTML = `<a href="#author-${author}"><span>${author}</span></a>`;

      /* insert HTML of the link into the author wrapper under each article */
      authorWrapper.innerHTML = linkHTML;

      /*  increment article count for the author */
      if (authors[author]) {
        authors[author]++;
      } else {
        authors[author] = 1;
      }
    }

    /*   find list of authors in right column */
    const authorList = document.querySelector(select.listOf.authors);

    /*   create variable for all links HTML code */
    let allAuthorsHTML = '';

    /*   START LOOP: for each author in authors: */
    for (let author in authors) {

      /*   generate code of a link and add it to allAuthorsHTML */
      allAuthorsHTML += `<li><a href="#author-${author}"><span>${author} (${authors[author]})</span></a></li>`;
    }

    /*   add HTML from allAuthorsHTML to authorList */
    authorList.innerHTML = allAuthorsHTML;
  }
  generateAuthors();

  function authorClickHandler(event){

    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-', '');

    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    /* START LOOP: for each active author link */
    for (let activeAuthorLink of activeAuthorLinks) {

      /* remove class active */
      activeAuthorLink.classList.remove('active');

    /* END LOOP: for each active author link */
    }

    /* find all author links with "href" attribute equal to the "href" constant (#author-<author>) */
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found author link */
    for (let authorLink of authorLinks) {

      /* add class active */
      authorLink.classList.add('active');
    /* END LOOP: for each found author link */
    }

    /* execute function "generateTitleLinks" with article selector as argument to display articles with the same author */
    generateTitleLinks(`[data-author="${author}"]`);
  }

  function addClickListenersToAuthors() {

    /* find all links to authors*/
    const authorLinks = document.querySelectorAll('.post-author a');

    /* START LOOP: for each link */
    for (let authorLink of authorLinks) {

      /* add authorClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);
    }
    /* END LOOP: for each link */
  }
  addClickListenersToAuthors();

})();
