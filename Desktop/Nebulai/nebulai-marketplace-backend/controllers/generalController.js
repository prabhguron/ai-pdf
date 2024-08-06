const sanitizeHtml = require('sanitize-html');
const {BUCKET_CDN_URI} = process.env;

const sanitizeHtmlString = (htmlStr) => {
  return sanitizeHtml(htmlStr || '', {
    allowedTags: sanitizeHtml.defaults.allowedTags, // Allow default set of HTML tags
    allowedAttributes: {
      'span': ["style"]
    }
  });
}

const formatTalentProfileAssets = (profile) => {
  try {
    profile.profileImage = `${BUCKET_CDN_URI}/${(profile?.profileImage?.length) ? profile.profileImage : 'user-default.png'}`
    profile.certificates = updatePropertyWithCDN(
      profile.certificates,
      'certificatesImages'
    );
  } catch (error) {
    console.log(error.message);
  }
  return profile
}

const formatCompanyProfileAssets = (profile) => {
  try {
    profile.profileImage = `${BUCKET_CDN_URI}/${(profile?.profileImage?.length) ? profile.profileImage : 'user-default.png'}`
    
    profile.projects = updatePropertyWithCDN(
      profile.projects,
      'projectsImages'
    );

    profile.caseStudies = updatePropertyWithCDN(
      profile.caseStudies,
      'caseStudiesImages'
    );

    profile.partnerships = updatePropertyWithCDN(
      profile.partnerships,
      'partnershipsImages'
    );

    profile.testimonials = updatePropertyWithCDN(
      profile.testimonials,
      'testimonialsImages'
    );

  } catch (error) {
    console.log(error.message)
  }
  return profile
}


const updatePropertyWithCDN = (info, property) => {
  return info.map((item) => ({
    ...item,
    [property]: item[property].map((value) => `${BUCKET_CDN_URI}/${value}`),
  }));
};

module.exports = {
  sanitizeHtmlString,
  formatTalentProfileAssets,
  formatCompanyProfileAssets
}