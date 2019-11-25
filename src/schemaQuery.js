const axios = require('axios');
const fs = require('fs');

axios.request({
  url: "/graphql",
  method: "post",
  baseURL: "http://development-api.identifi.com/",  
  headers: { 'Content-Type': 'application/json' },
  data: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then(async (result) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const finalResult = result.data;
    const filteredData = finalResult.data.__schema.types.filter(type => type.possibleTypes !== null);
    finalResult.data.__schema.types = filteredData;
    try {
      await fs.writeFileSync('./src/fragmentTypes.json', JSON.stringify(finalResult.data));
      console.log('Fragment types successfully extracted!');
    } catch(err) {
      console.error('Error writing fragmentTypes file', err);
    }
  });
