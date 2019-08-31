// create a class to toggle friendship when a link is clicked, using AJAX
class ToggleFriend{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleFriend();
    }


    toggleFriend(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                
                if (data.data.deleted == true){
                    $(self).html(` <a> <span>Add Friend </span> </a>`);
                    
                }else{
                    $(self).html(`<a> <span> Remove Friend </span> </a>`);
                }

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
