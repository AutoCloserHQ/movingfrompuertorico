// Analytics receives controlled event names and path-only URLs; quote details are never sent to GA4.
window.dataLayer=window.dataLayer||[];
window.gtag=function(){window.dataLayer.push(arguments)};
gtag('js',new Date());
const pageLocation=location.origin+location.pathname;
let pageReferrer='';try{pageReferrer=document.referrer?new URL(document.referrer).origin:''}catch{}
gtag('config','G-KJPYXXWGEV',{send_page_view:false,page_location:pageLocation,page_referrer:pageReferrer,allow_google_signals:false,allow_ad_personalization_signals:false});
gtag('event','page_view',{page_location:pageLocation,page_referrer:pageReferrer,page_title:document.title});
const ga=document.createElement('script');ga.async=true;ga.src='https://www.googletagmanager.com/gtag/js?id=G-KJPYXXWGEV';document.head.append(ga);
