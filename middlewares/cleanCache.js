const {clearHash} = require('../routes/blogRoutes');
module.exports=async(req,res,next)=>{
    await next();// espera a rota fazer tudo que precisa e então execute o que esta aqui
    clearHash( req.user.id);
    //desse modo so teremos a limpeza de cache se der certo o post 
}
