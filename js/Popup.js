//Enregistre lors du clique sur OK
$('#OK').click(function() {
    var url = "";
    var name = $('#Name').val();
    var picture = $('#picture').val();
    if(name != ""){
        if(picture == "")
            picture = "www.png";
        
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            url = tabs[0].url;
            var monobjet  = {
                name : url,
                picture : picture
            };
            var monobjet_json = JSON.stringify(monobjet);
            localStorage.setItem(name,monobjet_json);
        });
        window.close();
    }
});