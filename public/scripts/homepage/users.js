$('document').ready(function()
{

  buttonListeners()

});

function buttonListeners()
{
  $('button').on('click', function(e)
  {
    // e.preventDefault();
    console.log('submit new user');
    //createNewUserAjax();
  });

// function createNewUserAjax(){

//   newUserData = {
//     username : $('#inputUsername').val(),
//     email : $('#inputEmail').val(),
//     password : $('#inputPassword').val()
//   }
//   console.log(newUserData);
//    $.ajax({
//       'method' : 'POST',
//       'url' : '/users/create',
//       'data' : newUserData,
//       'success' : function()
//       {
//         console.log('new user creation successful');
//       },
//       'error' : function()
//       {
//         console.log('SNAKES IN NEW USER')
//       },
//       'complete' : function()
//       {
//       }
//     })
//   };

}
