class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
        this.isAdmin = false;
    }

    checkValidity(){
        let isValid = true;
        if (this.checkUsername && this.checkPassword){
            isValid = false;
        }
        return isValid;
    }

    checkUsername(){
        let isValid = true;
        if(!this.username){
            isValid = false;
        }
        
        if (this.username.length === 0){
            isValid = false;
        }
        return isValid;
    }
    checkPassword(){
        let isValid = true;

        if(!this.password){
            isValid = false;
        }

        if (this.password.length === 0){
            isValid = false;
        }
        return isValid;
    }
}

module.exports = {User};