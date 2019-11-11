//js和jsx的交互接口
var cs = new CSInterface();
//创建按钮点击
document.getElementById("btnCreate").addEventListener("click",function(){
    var width = document.getElementById("width").value;
    var height = document.getElementById("height").value;
    var resolution = document.getElementById("resolution").value;
    var docName = document.getElementById("docName").value;

    //执行main.jsx里面定义的creatNewDocument() 方法
    cs.evalScript("creatNewDocument("+width+","+height+","+resolution+",'"+docName+"')");
})





