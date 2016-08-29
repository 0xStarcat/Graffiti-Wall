function ajax_this(method, url, post_data, success_function, complete_function)
{
  $.ajax({
    'method' : method,
    'url' : url,
    'data' : post_data,
    'success' : function(data)
    {
      if (success_function)
      {
        success_function(data)
      }
    },
    'error' : function()
    {
      console.log('SNAKES! Error with '+method+' to '+url);
    },
    'complete' : function()
    {
      if (complete_function)
      {
        complete_function();
      }
    }
  })
}
