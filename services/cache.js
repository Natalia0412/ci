const mongosse = require('mongoose');
const redis =require('redis');
const keys = require('../config/keys');
const client = redis.createClient(keys.mongoURIredisUrl);
const util = ('util');
const promisify = require('util.promisify');
client.hget= promisify(client.hget).bind(client);
const exec = mongosse.Query.prototype.exec;
mongosse.Query.prototype.cache = function(options={}){
    this.useCashe=true;
    this.hashKey= JSON.stringify(options.key || 'default');
    return this;
}  
mongosse.Query.prototype.exec = async function(){
    if(!this.cache){
        return exec.apply(this,arguments);
    }
    const key = JSON.stringify( Object.assign({}, this.getQuery(),{ collection: this.mongooseCollection.name}));
    // verificar se valor existente em key ja existe no redis
    const cacheValue = await client.hget(this.hashKey,key);
    //se tem , retorna a mesma 
    if(cacheValue){
       const doc=  JSON.parse(cacheValue);// tranforma em objeto javascript
       return Array.isArray(doc)// verifica se é um array
       ? doc.map(d=> new this.model(d))// se sim, transforma cada elemento desse array em document como novo model
       : new this.model(doc);// se não, passa o document como um novo model 
       // o mongoose expera um codument do tipo model.Blogs , por isso o return esta desse jeito
       
    }
    // se não, faz a requisição pro mongodb, 
    const result = await  exec.apply(this,arguments);// executa await Blog.find({_user:req.user.id}); que esta no blogRoute.js
    //pega a resposta armazena no redis 
    client.hset(this.hashKey,key, JSON.stringify(result), 'EX', 10);
    //e envia a resposta pro cliente 
    return result;
}

module.exports ={
    clearHash(hashKey){
        client.del(JSON.stringify(hashKey))
    }
}