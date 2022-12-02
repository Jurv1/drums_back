import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const allPosts = await PostModel.find().exec()

        res.json(allPosts)
    } catch (err) {
        console.log(err)
        res.status(404).json({
            message: "Не удалось найти нужную информацию"
        })
    }
}

export const getTags = async (req, res) => {
    try {
        const allPosts = await PostModel.find().limit(5).exec()
        
        const tags = allPosts.map( e => e.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (err) {
        console.log(err)
        res.status(404).json({
            message: "Не удалось найти нужную информацию"
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndUpdate({
            id: postId
        },
            {
                $inc: { viesCount: 1 }
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: "Не удалось получить информацию"
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Нет нужной записи"
                    })
                }

                res.json(doc)
            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось создать пост"
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,

        })

        const post = await doc.save()

        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось создать пост"
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        PostModel.findOneAndDelete({
            id: postId
        },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: "Не удалось удалить информацию"
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Нет нужной записи"
                    })
                }

                res.json({
                    sucsess: true
                })
            }
        )
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось удалить пост"
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.updateOne({
            id: postId,
            
        },
        {
            text: req.body.text,
            title: req.params.title,
            tags: req.params.tags,
            user: req.userId,
            imageUrl: req.body.imageUrl
        })

                res.json({
                    message: "updated"
                })
        }
     catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось создать пост"
        })
    }
}
