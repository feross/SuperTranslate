// Author:      Feross Aboukhadijeh
// Site:        http://feross.org
// Powered by:  http://soundcloud.com/butchclancy/electro-flex

soundManager.url = '/swf/';
soundManager.flashVersion = 8;
var soundManagerLoaded = false;
soundManager.onload = function() {
    soundManagerLoaded = true;
};

var App = Base.extend({
    cards: [],
    headerAtTop: false, // Starts in vertical center and gets moved up
    
    onLoad: function() {
        var that = this;
        
        $('#cards').isotope({
            animationEngine: 'best-available',
            itemSelector: 'li',
            layoutMode: 'fitRows',
            // getSortData: {
            //     lastIsFirst: function ($elem) {
            //         return parseInt($elem.find('.num').text(), 10);
            //     }
            // },
            // sortBy: 'lastIsFirst',
            // sortAscending: false
        });
        
        $('#input').keyup(function(e) {
            if (e.keyCode == 13) {
                that.submit.call(that);
            }
        });
        
        $('button').click(function(e) {
            e.preventDefault();
            that.submit.call(that);
        });
        
        $('#header small a').click(function(e) {
            e.preventDefault();
            var text = $(e.target).text();
            $('#input').attr('value', text);
            $('button').click();
        });
        
        $('#cards li').live('click', function(e) {
            e.preventDefault();
            var code = $(e.target).attr('class').split(' ')[0];
            var word = $(e.target).find('.word').text();
            tts(word, code, $.noop);
        });
        
        $('#input').focus();
            
    },
    
    submit: function() {
        var that = this,
            fromWord = $.trim($('#input').val()),
            ajaxReqs = []; // array of all the translation ajax requests
            
        if (!fromWord) {
            tts('Type something first, dude.', 'en', $.noop);
            return;
        }
        
        if (!App.headerAtTop) {
            $('#header').addClass('top');
            App.headerAtTop = true; 
        }
        
        this.cards = []; // reset cards
        
	    $.each(App.LANGS, function(i, lang) {
            if (lang.tts != 'yes') {
                return;
            }
	        
	        var d = $.ajax({
	           dataType: 'jsonp',
	           
	           url: App.TRANSLATE_URL_PREFIX+'&source='+encodeURIComponent('en')+
	                '&target='+encodeURIComponent(lang.code)+
	                '&q='+encodeURIComponent(fromWord),
	                
	           success: function(trans) {
	               var toWord = trans && trans.data &&
	                            trans.data.translations &&
	                            trans.data.translations[0] &&
	                            trans.data.translations[0].translatedText;
	               
	               if (toWord) {
	                   var card = new Card(lang.code, lang.label, toWord);
	                   that.cards.push(card);
	               }
	               
	           }
	           
	        });
	        ajaxReqs.push(d);
	    });
	    
        $.when.apply(undefined, ajaxReqs)
            .done(function() {
                that.addEnglishCard.call(that, fromWord);
                that.loadCards();
            })
            .fail(function() {
                alert('One or more words failed to translate.');
            });
    },
    
    // TODO: Generalize this to any fromLanguage.
    addEnglishCard: function(word) {
        this.cards.push(new Card('en', 'English', word));
    },
    
    loadCards: function() {
        
        // Sort cards
        this.cards = _.sortBy(this.cards, function(card) {
            return card.label;
        });
        
        // Hide existing cards.
        $('#cards').isotope({ filter: ':not(li)'});
        
        window.setTimeout(function() {
            // Remove hidden cards and restore original filter setting.
            $('#cards')
                .isotope('remove', $('#cards li'))
                .isotope({filter: ''});
            
            Card.showAll(0);
            
        }, 800);

    }
},
{
    LANGS: [
    {code: 'af', label: 'Afrikaans', tts: 'bad'},
    {code: 'sq', label: 'Albanian', tts: 'bad'},
    {code: 'ar', label: 'Arabic', tts: 'yes'},
    // {code: 'hy', label: 'Armenian'},
    // {code: 'az', label: 'Azerbaijani'},
    // {code: 'eu', label: 'Basque'},
    {code: 'be', label: 'Belarusian', tts: 'no'},
    {code: 'bg', label: 'Bulgarian', tts: 'no'},
    {code: 'ca', label: 'Catalan', tts: 'bad'},
    {code: 'zh-CN', label: 'Chinese', tts: 'yes'},
    {code: 'hr', label: 'Croatian', tts: 'bad'},
    {code: 'cs', label: 'Czech', tts: 'yes'},
    {code: 'da', label: 'Danish', tts: 'yes'},
    {code: 'nl', label: 'Dutch', tts: 'yes'},
    {code: 'en', label: 'English', tts: 'yes'},
    {code: 'et', label: 'Estonian', tts: 'no'},
    {code: 'tl', label: 'Filipino', tts: 'no'},
    {code: 'fi', label: 'Finnish', tts: 'yes'},
    {code: 'fr', label: 'French', tts: 'yes'},
    {code: 'gl', label: 'Galician', tts: 'no'},
    // {code: 'ka', label: 'Georgian'},
    {code: 'de', label: 'German', tts: 'yes'},
    {code: 'el', label: 'Greek', tts: 'yes'},
    {code: 'ht', label: 'Haitian Creole', tts: 'low'},
    {code: 'iw', label: 'Hebrew', tts: 'no'},
    {code: 'hi', label: 'Hindi', tts: 'low'},
    {code: 'hu', label: 'Hungarian', tts: 'yes'},
    {code: 'is', label: 'Icelandic', tts: 'bad'},
    {code: 'id', label: 'Indonesian', tts: 'bad'},
    {code: 'ga', label: 'Irish', tts: 'no'},
    {code: 'it', label: 'Italian', tts: 'yes'},
    {code: 'ja', label: 'Japanese', tts: 'yes'},
    {code: 'ko', label: 'Korean', tts: 'yes'},
    // {code: 'la', label: 'Latin'},
    {code: 'lv', label: 'Latvian', tts: 'bad'},
    {code: 'lt', label: 'Lithuanian', tts: 'no'},
    {code: 'mk', label: 'Macedonian', tts: 'bad'},
    {code: 'ms', label: 'Malay', tts: 'no'},
    {code: 'mt', label: 'Maltese', tts: 'no'},
    {code: 'no', label: 'Norwegian', tts: 'yes'},
    {code: 'fa', label: 'Persian', tts: 'no'},
    {code: 'pl', label: 'Polish', tts: 'yes'},
    {code: 'pt', label: 'Portuguese', tts: 'yes'},
    {code: 'ro', label: 'Romanian', tts: 'bad'},
    {code: 'ru', label: 'Russian', tts: 'yes'},
    {code: 'sr', label: 'Serbian', tts: 'bad'},
    {code: 'sk', label: 'Slovak', tts: 'bad'},
    {code: 'sl', label: 'Slovenian', tts: 'no'},
    {code: 'es', label: 'Spanish', tts: 'yes'},
    {code: 'sw', label: 'Swahili', tts: 'bad'},
    {code: 'sv', label: 'Swedish', tts: 'yes'},
    {code: 'th', label: 'Thai', tts: 'no'},
    {code: 'tr', label: 'Turkish', tts: 'yes'},
    {code: 'uk', label: 'Ukrainian', tts: 'no'},
    // {code: 'ur', label: 'Urdu'},
    {code: 'vi', label: 'Vietnamese', tts: 'bad'},
    {code: 'cy', label: 'Welsh', tts: 'bad'},
    {code: 'yi', label: 'Yiddish', tts: 'no'}
    ],
    
    TRANSLATE_URL_PREFIX: 'https://www.googleapis.com/language/translate/v2?key=AIzaSyCHW3quKpNV0gc9WNElG61xJv8AS5Ee3Rk'
    
});

var app = new App();
$(function() {
    // Make 'this' be the app instance.
    app.onLoad.call(app);
});

var Card = Base.extend({
    constructor: function(code, label, word) {
        this.code = code;
        this.label = label;
        this.word = word;
    },
    
    // Uses continuation-passing.
    say: function(c) {
        tts(this.word, this.code, c);
    }
    
},
{
    // Uses continuation-passing style.
    showAll: function(i) {
        if (i >= app.cards.length) {
            return;
        }
                
        var card = app.cards[i];
        
        var $card = $('<li class="'+card.code+'"><span class="num">'+i+'</span><span class="label">'+card.label+'</span> <span class="word">'+card.word+'</span></li>');
        $('#cards').isotope('insert', $card);
        
        var inputText = $('#input').val();
        card.say(function() {
            // If value in #input changed, then don't continue.
            if (inputText != $('#input').val()) {
                return;
            }
            scrollToBottom();
            Card.showAll(i+1);
        });

    }
});

function tts(q, tl, c) {
    if (!soundManagerLoaded) {
        return;
    }
    
    var hash = hex_sha1(q+'####'+tl);
    
    soundManager
        .createSound({
            id: hash,
            url:'http://braingrinder.com/tts/'+hash+'.mp3'+
            '?q='+encodeURIComponent(q)+
            '&tl='+encodeURIComponent(tl)
        })
        .play({
            onfinish: function() {
                this.destruct();
                // window.setTimeout(c, 250);
                c && c();
            }
        });
}

function scrollToBottom() {
    var viewportHeight = $(window).height();
    var documentHeight = $(document).height();
    var scrollTop = documentHeight - viewportHeight;
    $('html, body').animate({scrollTop: scrollTop}, 'slow');
}
