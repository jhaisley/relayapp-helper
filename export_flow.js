(function() {
  // Only define console.save if it doesn't exist
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

  // Extract data and make query inside the IIFE
  const templateId = $r.props.router.state.query.templateId;
  const { trpcClient } = $r.hooks[0].value;

  trpcClient.query('flowtemplate.load', {
    id: templateId
  })
  .then(result => console.save(result, `flowtemplate_${templateId}.json`))
  .catch(console.error);
})();
