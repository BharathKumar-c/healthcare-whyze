const axios = require('axios');
const cheerio = require('cheerio');

// Function to clean text
function cleanText(text) {
  const $ = cheerio.load(text);

  $('em').replaceWith((_, el) => $(el).text());

  const textContent = $.root().text().trim();

  return textContent;
}

const tokenEndpoint = 'https://icdaccessmanagement.who.int/connect/token';
const clientId =
  '0b2667b1-c1a9-4734-b8d2-c6fb931c94fd_e9485071-69dd-40ec-b524-124619f0bf33';
const clientSecret = 'J7Lzz2KcVAg/6KKunklbdUN0QlhSdfVZj0fC9HGGKp4=';
const scope = 'icdapi_access';
const grantType = 'client_credentials';

const getConditions = async q => {
  try {
    // get the OAUTH2 token
    const payload = {
      client_id: clientId,
      client_secret: clientSecret,
      scope,
      grant_type: grantType,
    };

    const response = await axios.post(tokenEndpoint, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const token = response.data.access_token;

    // HTTP header fields to set
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Accept-Language': 'en',
      'API-Version': 'v2',
    };

    // Getting Latest Linearization
    const uri = 'https://id.who.int/icd/release/11/mms/';
    let r = await axios.get(uri, {
      headers,
    });
    r = r.data;

    const latestLinearization = r.latestRelease;
    console.log(latestLinearization);

    // access ICD API
    const searchUri = `${latestLinearization}/search`;
    const params = { q };
    r = await axios.get(searchUri, {
      headers,
      params,
    });
    r = r.data;

    const data = r.destinationEntities;

    const result = data.map(item => {
      const item_dict = {};
      const title = cleanText(item.title);
      const value = [];
      if (item.matchingPVs.length !== 0) {
        item.matchingPVs.forEach(synonym => {
          item_dict.medical_name = title;
          item_dict.icd10_code = cleanText(item.theCode);
          item_dict.name = cleanText(synonym.label);
          value.push(cleanText(synonym.label));
        });
      } else {
        item_dict.medical_name = title;
        item_dict.icd10_code = cleanText(item.theCode);
        item_dict.name = title;
      }
      return item_dict;
    });

    return { elements: result, count: result.length };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { getConditions };
