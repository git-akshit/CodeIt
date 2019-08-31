const User = require("../models/user");
const Friends = require("../models/friendship");

module.exports.toggleFriend = async function(req, res){
    try{
        let deleted = false;

        // friends/toggle/?id=abcdef
        //Check if a friendship already exists
        let existingFriends1 = await Friends.findOne({
            from_user: req.user._id,
            to_user: req.query.id
        })

        let existingFriends2 = await Friends.findOne({
            from_user: req.query.id,
            to_user: req.user._id
        })

        User1Friends = await User.findById(req.user._id).populate('friendships'); // if there are already existing friends for the user then populating them
        User2Friends = await User.findById(req.query.id).populate('friendships'); // if there are already existing friends for the user then populating them

        console.log(1);


        //if a friendship already exists then delete it
        if (existingFriends1 || existingFriends2){

            User1Friends.friendships.pull(req.query.id);
            User1Friends.save();

            User2Friends.friendships.pull(req.user._id);
            User2Friends.save();

            existingFriends1.remove();

            deleted = true;

        }else{
            // else make new friends

            let newFriend = await Friends.create({
                from_user: req.user._id,
                to_user: req.query.id
            });

            User1Friends.friendships.push(newFriend.to_user);
            User1Friends.save();

            User2Friends.friendships.push(newFriend.from_user);
            User2Friends.save();
            deleted = false;
        }

        return res.json(200, {
            message: "Request successful",
            data:{
                deleted : deleted
            }
        })

    }catch(err){ //it is ajax response so returning response
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

