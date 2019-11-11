var creatNewDocument = function (width, height, resolution, docName) {
    //使用photoshop api创建文档
    app.documents.add(width, height, resolution, docName);
}
