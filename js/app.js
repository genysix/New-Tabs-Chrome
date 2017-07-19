//Attribution d'un moteur de recherche (chargement de l'extension)
if (localStorage.getItem("moteur") === null) {
    localStorage.setItem("moteur", "https://www.google.ch/#q=");
}


//Permet d'afficher a chargement de la page tous les shortcuts
listAllItems();


//Rechercher sur internet au clique sur le bouton go
$('#searchButton').click(function() {
    var search = document.getElementById("search").value;
    if (search != "")
        document.location.href = encodeURI("https://www.youtube.com/results?search_query=" + search)
});


//Rechercher si la touche enter est presser
$('#search').keyup(function(e) {
    if (e.keyCode == 13) { // KeyCode de la touche entrée
        var search = document.getElementById("search").value;
    if (search != "")
        document.location.href = encodeURI(localStorage.getItem("moteur") + search)
    }
});


//Popup parametre (affiche)
$('#para').click(function() {
    $('.Popup').fadeToggle('fast', 'swing');
});


//Popup parametre (cache) si l'on clique ailleur que sur le popup
$(document).mouseup(function(e) {
    var container = $(".Popup");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});


//change l'auto selected en fonction du navigateur choisi
$('#changeMoteurRecherche option[value="' + localStorage.getItem("moteur") + '"]').prop('selected', true);

//Change le moteur de recherche par defaut
$('#changeMoteurRecherche').change(function() {
    localStorage.setItem("moteur", $('#changeMoteurRecherche').val());
});


//Ajouter des raccourcis
function addMore(key,name,picture) {
    $('#Shortcut').append('<div class="shortcut"><div class="Short"><span id="'+key+'" ><img src="'+picture+'" alt="img" height="50px" width="50px"><br><a href="'+name+'"></a><p>'+key+'</p></span></div></div>');
}


//Liste tous les raccourcis
function listAllItems(){  
    for (i=0; i<=localStorage.length-1; i++)  
    {  
        key = localStorage.key(i);
        if(key != "moteur"){
            var monobjet_json = localStorage.getItem(key);
            var monobjet = JSON.parse(monobjet_json);
            var name = monobjet.name;
            var picture = monobjet.picture
            addMore(key,name,picture); 
        }
    }  
}


var idPresser = null;
$(document).ready(function () {
    'use strict';
    var plugin = 'ContextMenu';

    var defaults = {
        hideAfterClick: false,
        contextMenuClass: 'context-menu',
        activeClass: 'active'
    };

    var ContextMenu = function(container, options) {
        this.container = $(container);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = plugin;
        this.init();
    };

    $.extend(ContextMenu.prototype, {
        init: function() {

            if (this.options.items) {
                this.items = $(this.options.items);
            }

            if (this._buildContextMenu()) {
                this._bindEvents();
                this._menuVisible = this._menu.hasClass(this.options.activeClass);
            }
        },

        _getCallback: function() {
            return ((this.options.callback && typeof this.options.callback ===
                'function') ? this.options.callback : function() {});
        },

        _buildContextMenu: function() {

            // Créeation du menu
            this._menu = $('<div>')
                .addClass(this.options.contextMenuClass)
                .append('<ul>');

            var menuArray = this.options.menu,
                menuList = this._menu.children('ul');

            // Créeation des items
            $.each(menuArray, function(index, element) {

                var item;

                if (element !== null && typeof element !==
                    'object') {
                    return;
                }

                if (element.name === 'void') {
                    item = $('<hr>');
                    menuList.append(item);
                    return;
                }

                item = $('<li>')
                    .attr('data-key', element.name)
                    .text(' ' + element.title);

                menuList.append(item);

            });

            $('body')
                .append(this._menu);

            return true;

        },

        _pDefault: function(event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        },

        _contextMenu: function(event) {

            event.preventDefault();

            // Conservez la valeur
            // il peut être utilisé en cas de clic listItem
            var _this = this;
            var element = event.target;

            if (this._menuVisible || this.options.disable) {
                return false;
            }

            var callback = this._getCallback();
            var listItems = this._menu.children('ul')
                .children('li');

            listItems.off()
                .on('click', function() {

                    var key = $(this)
                        .attr('data-key');
                    callback(key, element);
                    if (_this.options.hideAfterClick) {
                        _this.closeMenu();
                    }
                });

            this.openMenu();
            this._menu.css({
                'top': event.pageY + 'px',
                'left': event.pageX + 'px'
            });

            return true;
        },

        _onMouseDown: function(event) {
            // Retirez le menu si ont clique en dehors
            if (!$(event.target)
                .parents('.' + this.options.contextMenuClass)
                .length) {
                this.closeMenu();
            }
        },

        _bindEvents: function() {

            if (this.items) {
                // possibilité de se lier à des objets créés dynamiquement
                this.container.on('contextmenu', this.options.items,
                    $.proxy(this._contextMenu,
                        this));
            } else {
                this.container.on('contextmenu', $.proxy(this._contextMenu,
                    this));
            }

            // enlever le menu
            $(document)
                .on('mousedown', $.proxy(this._onMouseDown, this));

        },

        disable: function() {
            this.options.disable = true;
            return true;
        },

        destroy: function() {
            if (this.items) {
                this.container.off('contextmenu', this.options.items);
            } else {
                this.container.off('contextmenu');
            }
            this._menu.remove();
            return true;
        },

        openMenu: function() {
            this._menu.addClass(this.options.activeClass);
            this._menuVisible = true;
            return true;
        },

        closeMenu: function() {
            this._menu.removeClass(this.options.activeClass);
            this._menuVisible = false;
            return true;
        }

    });

    $.fn[plugin] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var item = $(this),
                instance = item.data(plugin);
            if (!instance) {
                item.data(plugin, new ContextMenu(this, options));
            } else {
                if (typeof options === 'string' && options[0] !== '_' &&
                    options !== 'init') {
                    instance[options].apply(instance, args);
                }
            }
        });
    };
    
    //recupere l'id du raccourcis
    $('.Short').on('contextmenu', 'span', function(e) {
        e.preventDefault();
        idPresser = this.id;
    });
    
    var context = $('#Shortcut').ContextMenu({

        hideAfterClick: true,

        items: '.shortcut',

        callback: function(key, element) {
                switch(key) {
                case "Modifier lien":
                        var monobjet_json = localStorage.getItem(idPresser);
                        var monobjet = JSON.parse(monobjet_json);
                        var name = monobjet.name;
                        var picture = monobjet.picture
                        var alerte = prompt("Modifier le lien", name);
                        if (alerte != null) {
                            
                            var monobjet  = {
                                name : alerte,
                                picture : picture
                            };
                            
                            monobjet_json = JSON.stringify(monobjet);
                            localStorage.setItem(idPresser,monobjet_json);
                            window.location.reload();
                        }
                    break;
                case "Modifier text":
                        var alerte = prompt("Modifier le text", idPresser);
                        if (alerte != null) {
                            var monobjet_json = localStorage.getItem(idPresser);
                            var monobjet = JSON.parse(monobjet_json);
                            var name = monobjet.name;
                            var picture = monobjet.picture
                            var monobjet  = {
                                name : name,
                                picture : picture
                            };
                            
                            monobjet_json = JSON.stringify(monobjet);
                            localStorage.removeItem(idPresser);
                            localStorage.setItem(alerte,monobjet_json);
                            window.location.reload();
                        }
                    break;
                case "Modifier image":
                        var monobjet_json = localStorage.getItem(idPresser);
                        var monobjet = JSON.parse(monobjet_json);
                        var name = monobjet.name;
                        var picture = monobjet.picture
                        var alerte = prompt("Modifier l'image", picture);
                        if (alerte != null) {
                            
                            var monobjet  = {
                                name : name,
                                picture : alerte
                            };
                            
                            monobjet_json = JSON.stringify(monobjet);
                            localStorage.setItem(idPresser,monobjet_json);
                            window.location.reload();
                        }
                    break;
                case "Supprimer":
                        localStorage.removeItem(idPresser);
                        window.location.reload();
                    break;
            }
        },

        menu: [

            {
                name: 'Modifier lien',
                title: 'Modifier lien',
                icon: 'archive',
            },

            {
                name: 'Modifier text',
                title: 'Modifier text',
                icon: 'archive',
            },

            {
                name: 'Modifier image',
                title: 'Modifier image',
                icon: '',
            },

            {
                name: 'void' //Séparateur
            },
            
            {
                name: 'Supprimer',
                title: 'Supprimer',
                icon: 'trash',
            },
        ]
    });
});