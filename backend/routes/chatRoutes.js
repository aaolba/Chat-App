const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const { accessChat, fetchChats, createGroueChat, removeFromGroup, renameGroup, addToGroup } = require("../controllers/chatController")

const router = express.Router()

router.route('/').post(protect, accessChat).get(protect, fetchChats)
router.route("/groupe").post(protect, createGroueChat)
router.route('/rename').put(protect, renameGroup)
//to be added next
// router.route('/groupremove').put(protect, removeGroup)
router.route('/groupremove').put(protect, removeFromGroup)
router.route("/groupadd").put(protect, addToGroup)

module.exports = router