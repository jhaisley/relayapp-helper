(function() {
    // Save helper
    if (!console.save) {
      console.save = function(data, filename) {
        if(!data) {
          console.error('No data');
          return;
        }
  
        if(!filename) filename = 'flowtemplate.json';
  
        if(typeof data === "object"){
          data = JSON.stringify(data, undefined, 4);
        }
  
        const blob = new Blob([data], {type: 'text/json'});
        const e = document.createEvent('MouseEvents');
        const a = document.createElement('a');
        
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      };
    }

    // Get template ID from URL
    function getTemplateId() {
        const match = window.location.pathname.match(/\/workflows\/([^/]+)\/edit/);
        return match ? match[1] : null;
    }

    // Create minimal tRPC client
    const trpcClient = {
        query: async (path, input) => {
            const response = await fetch(`/api/trpc/${path}?input=${encodeURIComponent(JSON.stringify({json: input}))}`, {
                headers: {
                    'accept': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const result = await response.json();
            return result.result.data;
        }
    };

    // Execute query
    const templateId = getTemplateId();
    if (templateId) {
        trpcClient.query('flowtemplate.load', {
            id: templateId
        })
        .then(result => console.save(result, `flowtemplate_${templateId}.json`))
        .catch(console.error);
    }
})();
