class Helpers {

    mod(base, num){
      return ((base%num)+num)%num;
    }

}

var helpers = new Helpers();