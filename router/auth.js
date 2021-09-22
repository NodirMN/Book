const {Router} = require('express')
const router = Router()
const User = require('../modeles/user')
const bcrypt = require('bcryptjs')
router.get('/login',async(req,res)=>{
    res.render('auth/login',{
        title: 'Tizimga kirish',
        error: req.flash('error'),
        success: req.flash('success'),
        layout: 'nohead'
    })
})
router.get('/registration',async(req,res)=>{
    res.render('auth/reg',{
        title: 'Ro`yhatdan o`tish',
        error: req.flash('error'),
        success: req.flash('success'),
        layout: 'nohead'
    })
})
router.post('/reg',async(req,res)=>{
    const {name,email,lname,password,rpassword} = req.body
    const reallyMen = await User.findOne({email})
    if (reallyMen){
        req.flash('error','Bunday emaildagi foydalanuvchi mavjud!')
        res.redirect('/auth/registration')
    } else {
        const hashPass = await bcrypt.hash(password,10)
        const really = await new User({name, lname, email, password: hashPass})
        await really.save()
        req.flash('success','Ro`yhatdan muvaffaqiyatli o`tildi!')
        res.redirect('/auth/login')
    }
})
router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if (err) throw err
        res.redirect('/auth/login')
    })
})
router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    const maybeUser = await User.findOne({email})
    if (maybeUser){
        const comparePass = await bcrypt.compare(password,maybeUser.password)
        if (comparePass){
            req.session.user = maybeUser
            req.session.isAuthed = true
            req.session.save((err)=>{
                if (err) throw err 
                else res.redirect('/')
            })
        } else {
            req.flash('error','Mahfiy kalit notogri kiritildi') 
            res.redirect('/auth/login') 
        }
    } else {
        req.flash('error','Bunday emaildagi foydalanuvchi mavjud emas')
        res.redirect('/auth/login')
    }
})
module.exports = router