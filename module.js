// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * JavaScript library for the quiz module.
 *
 * @package    mod
 * @subpackage questionnaire
 * @copyright  
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


/**
 * Javascript for hiding/displaying children questions on preview page of 
 * questionnaire with conditional branching. 
 */

function dependdrop(qId, children) {
	var e = document.getElementById(qId);
	var choice = e.options[e.selectedIndex].value;
	depend (children, choice);
}

function depend (children, choices) {
	children = children.split(',');
	choices = choices.split(',');
	var childrenlength = children.length;
	var choiceslength = choices.length;
    child = null;
	choice = null;
	for (var i = 0; i < childrenlength; i++) {
		child = children[i];
		var q = document.getElementById(child);
		if (q) {
			var radios = q.getElementsByTagName('input');
			var radiolength = radios.length;
 			var droplists = q.getElementsByTagName('select');
			var droplistlength = droplists.length;
            var textareas = q.getElementsByTagName('textarea');
			var textarealength = textareas.length;
			for (var k = 0; k < choiceslength; k++) {
	            choice = choices[k];
				if (child == choice) {
					q.classList.add('qn-container');
					for (var j = 0; j < radiolength; j++) {
						radio = radios[j];
						radio.disabled=false ;
					}
					for (var m = 0; m < droplistlength; m++) {
						droplist = droplists[m];
						droplist.disabled=false ;
					}
					delete children[i];
				} else if (children[i]){
					q.classList.remove('qn-container');
                    q.classList.add('hidedependquestion');
					for (var j = 0; j < radiolength; j++) {
						radio = radios[j];
						radio.disabled=true;
						radio.checked=false;
					}
					for (var m = 0; m < droplistlength; m++) {
						droplist = droplists[m];
                        droplist.selectedIndex = 0;
						droplist.disabled=true;
                        droplist.checked=false;
					}
                    for (var n = 0; n < textarealength; n++) {
						textarea = textareas[n];
                        textarea.value = '';
					}
				}
			}
		}
	}
}
// End conditional branching functions.

// When respondent enters text in !other field, corresponding 
// radio button OR check box is automatically checked.
function other_check(name) {
  other = name.split("_");
  var f = document.getElementById("phpesp_response");
  for (var i=0; i<=f.elements.length; i++) {
    if (f.elements[i].value == "other_"+other[1]) {
      f.elements[i].checked=true;
      break;
    }
  }
}

// Automatically empty an !other text input field if another Radio button is clicked.
function other_check_empty(name, value) {
  var f = document.getElementById("phpesp_response");
  for (var i=0; i<f.elements.length; i++) {
    if ((f.elements[i].name == name) && f.elements[i].value.substr(0,6) == "other_") {
        f.elements[i].checked=true;
        var otherid = f.elements[i].name + "_" + f.elements[i].value.substring(6);
        var other = document.getElementsByName (otherid);
        if (value.substr(0,6) != "other_") {
           other[0].value = "";
        } else {
            other[0].focus();
        }
        var actualbuttons = document.getElementsByName (name);
          for (var i=0; i<=actualbuttons.length; i++) {
            if (actualbuttons[i].value == value) {
                actualbuttons[i].checked=true;
                break;
            }
        }
    break;
    }
  }
}

// In a Rate question type of sub-type Order : automatically uncheck a Radio button
// when another radio button in the same column is clicked.
function other_rate_uncheck(name, value) {
    col_name = name.substr(0, name.indexOf("_"));
    var inputbuttons = document.getElementsByTagName("input");
    for (var i=0; i<=inputbuttons.length - 1; i++) {
        button = inputbuttons[i];
        if (button.type == "radio" && button.name != name && button.value == value
                    && button.name.substr(0, name.indexOf("_")) == col_name) {
            button.checked = false;
        }
    }
}

// Empty an !other text input when corresponding Check Box is clicked (supposedly to empty it).
function checkbox_empty(name) {
    var actualbuttons = document.getElementsByName (name);
    for (var i=0; i<=actualbuttons.length; i++) {
        if (actualbuttons[i].value.substr(0,6) == "other_") {
            name = name.substring(0,name.length-2) + actualbuttons[i].value.substring(5);
            var othertext = document.getElementsByName (name);
            if (othertext[0].value == "" && actualbuttons[i].checked == true) {
                othertext[0].focus();
            } else {
                othertext[0].value = "";
            }
            break;
        }
    }
}


M.mod_questionnaire = M.mod_questionnaire || {};

M.mod_questionnaire.init_attempt_form = function(Y) {
    M.core_question_engine.init_form(Y, '#phpesp_response');
    M.core_formchangechecker.init({formid: 'phpesp_response'});
};

M.mod_questionnaire.init_sendmessage = function(Y) {
    Y.on('click', function(e) {
        Y.all('input.usercheckbox').each(function() {
            this.set('checked', 'checked');
        });
    }, '#checkall');

    Y.on('click', function(e) {
        Y.all('input.usercheckbox').each(function() {
            this.set('checked', '');
        });
    }, '#checknone');

    Y.on('click', function(e) {
        Y.all('input.usercheckbox').each(function() {
            if (this.get('alt') == 0) {
                this.set('checked', 'checked');
            } else {
            	this.set('checked', '');
            }
        });
    }, '#checknotstarted');

    Y.on('click', function(e) {
        Y.all('input.usercheckbox').each(function() {
            if (this.get('alt') == 1) {
                this.set('checked', 'checked');
            } else {
            	this.set('checked', '');
            }
        });
    }, '#checkstarted');

};

