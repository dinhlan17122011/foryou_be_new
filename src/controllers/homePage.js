
class home {
    async index(req, res) {
      try{
        res.render('homePage')
      }catch(err){
        res.status(500).json({error:err})
      }
    }

  }
  
export default new home();