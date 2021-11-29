import userController from "../../controllers/userController"

function signUpUser({first_name, last_name, telegram_username, telegram_id})
{
    userController.getUserByTelegramId({telegram_id})
        .then((shit, err) => console.log({shit, err}))
}

export default signUpUser