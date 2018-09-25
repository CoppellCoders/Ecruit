const Discord = require("discord.js");
const superagent = require("superagent");

module.exports.run=async(bot, message, args) =>{
    //Checks if Username is provided
    if(!args[0]){
        return message.channel.send("Error. Please specify a username for PUBG `.pubg <username> `");
    }
    let username =args[0];
    
   if(args[0].toUpperCase()=="season".toUpperCase()||args[0]=="seasons".toUpperCase()){
    console.log("SEASONS");   
    let embed=new Discord.RichEmbed().setTitle("**PUBG SEASONS LIST**");
        let seasons= await getSeasons();
        console.log(seasons.length);
        for (let index = 0; index < seasons.length; index++) {
            embed.addField(seasons[index],"TEST");
            
        }
        return message.channel.send(embed);
    }

   else if(!args[2]){
       let profileStats= await getProfileStats(username); //Gets basic stats

        console.log(profileStats);

       let embed= new Discord.RichEmbed().setTitle(`**PUBG STATS FOR ${profileStats.name.toUpperCase()}**`);

       return message.channel.send(embed);
   }

   //Gets stats of a profile with provided Username
   async function getProfileStats(username) {
    //Accesses the API 
    let {body} = await superagent
        .get(`https://api.pubg.com/shards/pc-na/players?filter[playerNames]=${username}`)
        .set("Authorization", process.env.pubg_key)
        .set("accept", "application/vnd.api+json")
        .on("error", err=>{
            return message.channel.send(
                "Error occurred while retrieving player stats. Please try again later.\n\n **If this problem keeps arising, make sure you use the `!issue` command to report any issues with the bot**"
            );
        });
    console.log(body);
    //API error Handling
        if(Object.keys(body).length===0){
            return message.channel.send(
                "Error occurred while retrieving player stats. Please try again later"
            );
           
        }
        let stats = body.data;
        let id = stats.id;
        let playerName=stats[0].attributes.name;
        return{
            name: playerName, 
            id: id   
        };
    }

   async function getSeasons(){
        let {body} = await superagent
            .get(`https://api.pubg.com/shards/pc-na/seasons`)
            .set("Authorization", process.env.pubg_key)
            .set("accept", "application/vnd.api+json")
            .on("error", err=>{
                return message.channel.send(
                    "Error occurred while retrieving season stats. Please try again later.\n\n **If this problem keeps arising, make sure you use the `!issue` command to report any issues with the bot**"
                );
            });

        let data =body.data;
        
        let seasonsNames =new Array();
        for (let index = 0; index < data.length; index++) {
            
            seasonsNames.push(body.data[index].id);
        }

      
        seasonsNames.reverse();
        seasonsNames.forEach(function(element,index ) {
          seasonsNames[index]= element.substring(element.lastIndexOf(".")+1);
            
        });
        console.log(seasonsNames);
        return seasonsNames;
   }
}
   
module.exports.help = {
    name: "pubg"
  };
  