// 'use strict';
// document.getElementById('test-button').addEventListener('click', function(){
//     const links = document.querySelectorAll('.titles a');
//     console.log('links:', links);
//   });
// const links = document.querySelectorAll('.titles a');

// for(let link of links){
//   console.log(link);
// }

{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
    articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  };
  /* remove class 'active' from all article links  */
  //Creative object opt
  const opt = {
    ArticleSelector: '.post',
    TitleSelector: '.post-title',
    TitleListSelector: '.titles',
    ArticleTagSelector: '.post-tags .list',
    ArticleAuthor: '.post-author',
    // optTagsListSelector = '.list.tags',
    CloudClassCount: '5',
    CloudClassPrefix: 'tag-size-'
  };
  const titleClickHandler = function (event) {
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    // console.log('Link was clicked!');
    /* [DONE]remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [IN PROGRESS] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* [DONE]remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .post.active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    // console.log(articleSelector);
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    // console.log(targetArticle);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };
  const generateTitleLinks = function (customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(opt.TitleListSelector);
    titleList.innerHTML = ' ';
    // console.log(titleList);
    /* for each article */
    const articles = document.querySelectorAll(opt.ArticleSelector + customSelector);

    // console.log(articles);
    for (let article of articles) {
      // /* get the article id */zmiena pętli for
      const articleId = article.getAttribute('id');
      /* find the title element */
      const articleTitle = article.querySelector(opt.TitleSelector).innerHTML;
      // console.log(articleTitle);
      /* get the title from the title element */
      const linkHTMLData = {
        id: articleId, 
        title: articleTitle
      };
      const linkHTML = templates.articleLink(linkHTMLData);
      // console.log(linkHTML);
      /* create HTML of the link */
      // titleList.innerHTML = titleList.innerHTML + linkHTML;
      /* insert link into titleList */
      titleList.insertAdjacentHTML('beforeend', linkHTML);
    }
    const links = document.querySelectorAll('.titles a');
    // console.log(links);
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();

  const calculateTagsParams = function(tags) {
    const params = {
      max: 0,
      min: 999999
    };
    for (let tag in tags) {
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      } else if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
      // console.log(tag);
      // console.log(tag + ' is used ' + tags[tag] + ' times');
    }
    return params;
  };
  const calculateTagClass = function (count, params) {
    const classNumber = Math.floor(((count - 2) / (params.max - 2)) * (opt.CloudClassCount - 1) + 1);
    return opt.CloudClassPrefix + classNumber;
  };

  const generateTags = function () {

    /* [NEW] create a new variable allTags with an empty object */
    // zmienna dodana na potrzeby generowania linków w sidebar
    let allTags = {};
    // console.log(allTags);
    /* find all articles */
    const articles = document.querySelectorAll(opt.ArticleSelector);
    // console.log(articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagWrapper = article.querySelector(opt.ArticleTagSelector);
      // console.log(tagWraper);
      /* make html variable with empty string */
      let html = '';
      // console.log(html);
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      // console.log(articleTags);
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      // console.log(articleTagsArray);
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        // console.log(tag);
        /* generate HTML of the link */
        const linkHTMLData = {
          tag: tag,
          title: tag
        };
        const linkHTML = templates.articleTag(linkHTMLData);
        /* add generated code to html variable */
        html = linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [NEW] add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
          // console.log(allTags);
          /* END LOOP: for each tag */
        }
        /* insert HTML of all the links into the tags wrapper */
        tagWrapper.insertAdjacentHTML('beforeend', html);
        /* END LOOP: for every article: */
      }
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');
    console.log(tagList);
    const tagsParams = calculateTagsParams(allTags);
    // console.log('tagsParams:', tagsParams);
    /* [NEW] create variable for all links HTML code */
    let allTagsHTML = '';
    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      // console.log(tag);
      /* [NEW] generate code of a link and add it to allTagsHTML */

      const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag +'</a></li>';
      // console.log('tagLinkHTML:', tagLinkHTML);
      allTagsHTML += tagLinkHTML;
    }
    /* [NEW] END LOOP: for each tag in allTags: */
    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
    // console.log(tagList);
  };

  generateTags();
  const tagClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    // console.log(href);
    // /* make a new constant "tag" and extract tag from the "href" constant */nie rozumiem tego
    const tag = href.replace('#tag-', '');
    // console.log(tag);
    /* find all tag links with class active */
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
    // console.log(activeTags);
    /* START LOOP: for each active tag link */
    for (let activeTag of activeTags) {
      /* remove class active */
      activeTag.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagslinker = document.querySelectorAll('a[href="' + href + '"]');
    // console.log(tagslinker);
    /* START LOOP: for each found tag link */
    for (let tagLink of tagslinker) {
      /* add class active */
      tagLink.classList.add('active');
    }
    /* END LOOP: for each found tag link */
    // /* execute function "generateTitleLinks" with article selector as argument */ argument
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };
  const addClickListenersToTags = function () {
    /* find all links to tags */
    const allLinksToTags = document.querySelectorAll('a[href^="#tag"]');
    /* START LOOP: for each link */
    // console.log(allLinksToTags);
    for (let linkToTag of allLinksToTags) {
      // /* add tagClickHandler as event listener for that link *
      linkToTag.addEventListener('click', tagClickHandler);
    }
  };
  addClickListenersToTags();
  //funkcja generująca autorów pod tytułem artykułów
  const generateAuthor = function () {
    //object New allAuthor
    const allAuthor={};
    /* find all articles */
    const authors = document.querySelectorAll(opt.ArticleSelector);
    // console.log(authors);
    for (let author of authors) {
      /* find tags wrapper */
      const authorWraper = author.querySelector(opt.ArticleAuthor);
      // console.log(authorWraper);
      /* make html variable with empty string */
      const artAuthor = author.getAttribute('data-author');
      // console.log(articleAuthor);
      let html = '';
      // console.log(html);
      /* generate HTML of the link */
      
      const linkHTMLData = {
        author: artAuthor,
        title: artAuthor,
      };
      const linkHTML = templates.articleAuthor(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      if (!allAuthor[artAuthor]) {
        /* [NEW] add generated code to allTags array */
        allAuthor[artAuthor] = 1;
      } else {
        allAuthor[artAuthor]++;
        // console.log(allAuthor);
        // console.log(allTags);
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      authorWraper.insertAdjacentHTML('beforeend', html);
      console.log(html);
      /* END LOOP: for every article: */
    }
    //łapanie classy tagów Autorów
    const authorListClass = document.querySelector('.authors');
    console.log(authorListClass);
    // use funcition calculateTagsParams to Authors
    const tagAuthors = calculateTagsParams(allAuthor);
    console.log('tagAuthors', tagAuthors);

    let allTagsAuthorHTML = '';

    for(let Author in allAuthor){

      const authorLinkHTML = '<li><a href="#author-' + Author + '" class="' + calculateTagClass(allAuthor[Author], tagAuthors) + '">' + Author + '</a></li>';
      // console.log(authorLinkHTML);
      allTagsAuthorHTML += authorLinkHTML;

    }
    authorListClass.innerHTML = allTagsAuthorHTML;
 
  };
  generateAuthor();
  //funkcje addClickListenersToAuthors i authorClickHandler
  const authorClickHandler = function (event) {
    console.log('sprzedam opa');
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    // console.log(href);
    const author = href.replace('#author-', '');
    // console.log('Autor:' + author)
    // console.log(author);
    const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
    // console.log(activeAuthors);	    
    for (let activeAuthor of activeAuthors) {
      activeAuthor.classList.remove('active');
    }
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
    // console.log(authorLinks);	
    for (let authorLink of authorLinks) {
      authorLink.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
  };
  const addClickListenersToAuthors = function () {
    
    /* find all links to tags */
    const allLinksToAuthor = document.querySelectorAll('a[href^="#author"]');
    /* START LOOP: for each link */
    console.log(allLinksToAuthor);
    // console.log(allLinksToAuthor);
    for (let linkAutor of allLinksToAuthor) {

      // /* add tagClickHandler as event listener for that link *
      linkAutor.addEventListener('click', authorClickHandler);
    }
  };
  addClickListenersToAuthors();
}