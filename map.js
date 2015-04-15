
function login(){
    $("#userinfo").html('<a class="proflink" href="profile.html">Jazzy Jeff</a><input type="button" class="btn" onclick="logout()" value="Logout">');
}
function logout(){
    $("#userinfo").html('<input type="button" class="btn" onclick="login()" value="Login">');
}