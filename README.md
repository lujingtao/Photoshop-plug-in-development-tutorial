@[toc](手把手教你开发photoshop面板插件（附demo和工具）)

# 一、前言
phtoshop插件通常有2中方式，一种是以“脚本运行”的方式，另一种是“面板插件”的方式，最近自己需要做一个面板插件，但是发现相关教程实在太少了，本文以我所了解到的介绍给大家。

# 二、插件演示
先看看成果，我使用的ps是cc2018（19.1.4版本），这个H标志的插件就是本文制作的插件，功能很简单，就是按所填参数新建一份文档。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191111104500861.gif)

# 三、目录文件介绍
### 3.1 插件安装
自从cc2015之前，面板插件是使用flash开发的，2015（含2015）之后是使用html开发的，所以你想使用本插件，**请把ps更新到cc2015之后，并且你需具有前端技术（html+css+js）**。
插件目录位置为：``ps安装目录\Required\CEP\extensions\插件文件夹``
例如本示例插件目录为：``ps安装目录\Required\CEP\extensions\dhzx.CreatNewDocument``

### 3.2 开启ps开发模式
ps如果加载没签名的插件会提示“无法加载xxx扩展，因为它未经正确签署”：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191111171809601.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lhbWx1amluZ3Rhbw==,size_16,color_FFFFFF,t_70)
所以我们要先开启ps的开发模式，请执行附件“相关工具”中的
``开启ps扩展开发者模式（解决无法加载扩展,因为它未经正确签署）.reg``
``关闭ps扩展开发者模式.reg``
### 3.3 插件文件介绍
插件基本目录结构如下，建议你开发插件以本示例为基础进行开发：
```
dhzx.CreatNewDocument
├─ CSXS 
│  └─ manifest.xml （规定文件，定义插件的信息和属性）
├─ css 
│  └─ style.css （样色文件）
├─ img 
│  └─ icon.png （插件图标）
├─ index.html （程序入口）
├─ js
│  ├─ CSInterface.js （保留文件，js和jsx交互所需的接口）
│  └─ main.js （js文件用于与html和jsx交互）
└─ jsx
   └─ main.jsx （jsx文件用于与ps交互）
```
- 其中 manifest.xml文件为必须文件，定义了插件的信息和属性；
- CSInterface.js 是js和jsx交互所需的接口，只有jsx文件可以操作ps，js是不能直接操作的，所以要通过CSInterface.js这个接口来实现js和jsx的交换；
- index.html是程序入口文件；
- 主要文件之间的关联是这样的：
``index.html <--> main.js <--> CSInterface.js <--> main.jsx <--> ps``

### 3.4 manifest 文件介绍
manifest.xml文件为必须文件，定义了插件的信息和属性，必要的地方我添加了注释

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<ExtensionManifest Version="4.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ExtensionBundleId="dhzx.CreatNewDocument" ExtensionBundleName="dhzx.CreatNewDocument" ExtensionBundleVersion="5.0.18">
    <Author>大话主席</Author>
    <Contact mailto="**@abc.com" />
    <Abstract href="http://www.superslide2.com/" />
    <ExtensionList>
        <Extension Id="dhzx.CreatNewDocument" Version="1.0" /> <!-- 插件ID 和 版本-->
    </ExtensionList>

    <ExecutionEnvironment>
        <HostList>
            <!-- 设置插件能在 14.0 版本之后 PhotoShop 中运行-->
            <Host Name="PHXS" Version="14.0" />
            <Host Name="PHSP" Version="14.0" />
            <Host Name="ILST" Version="17.0" />
        </HostList>

        <LocaleList>
            <Locale Code="All" />
        </LocaleList>

        <RequiredRuntimeList>
            <RequiredRuntime Name="CSXS" Version="6.0" />
        </RequiredRuntimeList>

    </ExecutionEnvironment>
    <DispatchInfoList>
        <Extension Id="dhzx.CreatNewDocument">
            <DispatchInfo>
                <Resources>
                    <MainPath>./index.html</MainPath> <!-- 程序入口-->
                    <ScriptPath>./jsx/main.jsx</ScriptPath> <!-- 插件自动加载的jsx文件 -->
                </Resources>

                <Lifecycle>
                    <AutoVisible>true</AutoVisible>
                    <StartOn></StartOn>
                </Lifecycle>

                <UI>
                    <Type>Panel</Type> <!-- 插件模式：面板-->
                    <Menu>CreatNewDocument</Menu> <!-- 插件在面板上的标题-->
                    <Geometry> <!-- 插件尺寸-->
                        <Size>
                            <Height>320</Height>
                            <Width>260</Width>
                        </Size>
                        <MaxSize>
                            <Height>320</Height>
                            <Width>260</Width>
                        </MaxSize>
                        <MinSize>
                            <Height>300</Height>
                            <Width>260</Width>
                        </MinSize>
                    </Geometry>
                    <Icons><!-- 插件图标-->
                        <Icon Type="Normal">./img/icon.png</Icon>
                        <Icon Type="RollOver">./img/icon.png</Icon>
                        <Icon Type="DarkNormal">./img/icon.png</Icon>
                        <Icon Type="DarkRollOver">./img/icon.png</Icon>
                    </Icons>
                </UI>
            </DispatchInfo>
        </Extension>
    </DispatchInfoList>
</ExtensionManifest>
```
- 其中插件id是唯一的，用于区分其它插件，例如本示例中的id为“dhzx.CreatNewDocument”，所以你新建插件的时候要替换文件中的所有 “dhzx.CreatNewDocument”为你的插件id。
- ``<MainPath>./index.html</MainPath> <!-- 程序入口-->
<ScriptPath>./jsx/main.jsx</ScriptPath> <!-- 插件自动加载的jsx文件 -->``
MainPath 和 ScriptPath 2个节点比较重要，用于定义程序入口，和激活程序时自动加载的jsx文件。

### 3.5 jsx文件加载的2中方式
jsx文件加载有2中方式：
- 一种是在manifest.xml文件中以 ``<ScriptPath>./jsx/main.jsx</ScriptPath>``
节点来加载，但貌似只能加载一个文件。
- 另一种是在js里面动态加载，个人推荐第二种方式，比较灵活

```js
var cs = new CSInterface();
function loadJSX(fileName)
{
    var extensionRoot = cs.getSystemPath(SystemPath.EXTENSION) + "/jsx/";// 这里是指插件目录下的 jsx 文件夹，可自行设为任意目录
    cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
}
loadJSX("a.jsx");
loadJSX("b.jsx");
```

### 3.6 js和jsx交互
js和jsx是分别运行在不同环境的，所以二者交换要通过 CSInterface.js 提供的接口。
js 中用 CSInterface 的 evalScript()方法就可以执行 JSX 代码：
```css
var cs = new CSInterface();
cs.evalScript("app.documents.add();")
```
evalScript(script, callback)方法接受 2 个参数，第一个是要执行的 JSX 代码，第二个是接受执行返回值的回调函数。

### 3.7 index.html 程序入口
主要是制作插件界面，引用css、js文件
```html
<!DOCTYPE html>
<html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link href="./css/style.css" type="text/css" rel="stylesheet">
  </head>
  <body>
    
    <div class="app">
      <h3>新建文档</h3>
      <main class="main">
        <div class="in">
          <div class="row">
            <label>　　宽：</label><input type="number" value="100" id="width"> 像素
          </div>
          <div class="row">
            <label>　　高：</label><input type="number" value="100" id="height"> 像素
          </div>
          <div class="row">
            <label>分辨率：</label><input type="number" value="72" id="resolution"> 像素/英寸
          </div>
          <div class="row">
            <label>　名称：</label><input type="text" value="New Document" id="docName">
          </div>
          <div class="row">
            <label> </label><button id="btnCreate">创建</button>
          </div>
        </div>
      </main>
    </div>

    <script type="text/javascript" src="./js/CSInterface.js"></script>
    <script type="text/javascript" src="./js/main.js"></script>
  </body>
</html>
```

### 3.8 main.js
main.js获取index.html上输入的信息，然后通过cs.evalScript 执行 main.jsx 定义的 creatNewDocument 方法。
```js
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

```
### 3.9 main.jsx
main.jsx 定义了creatNewDocument 方法，然后通过 app.documents.add() 方法来创建文档。
```js
var creatNewDocument = function (width, height, resolution, docName) {
    //使用photoshop api创建文档
    app.documents.add(width, height, resolution, docName);
}
```

# 四、打包插件
- 打包插件可以使用附件“相关工具”中的“ZXP WinGUI.exe”，先创建“证书”，再打包插件。
注意，打包成zip文件即可，别人使用的时候解压缩到插件目录就可以使用了。
``ps安装目录\Required\CEP\extensions\``

- <font color="red">注意：打包后的插件，对插件做任何修改ps都不会生效，是为了防止插件被他人恶意写入程序，只能在开发模式才可以修改。</font>
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191111173842470.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lhbWx1amluZ3Rhbw==,size_16,color_FFFFFF,t_70)

# 五、源码和相关工具
[**GitHub地址**](https://github.com/lujingtao/Photoshop-plug-in-development-tutorial)
欢迎 Star！

# 六、参考资料
### 6.1 photoshop插件开发教程
[photoshop插件开发教程](http://nullice.com/archives/category/note/%E8%BD%AF%E4%BB%B6%E6%95%99%E7%A8%8B/adobe-cep)

### 6.2 photoshop脚本官方文档
[photoshop脚本官方文档](http://wwwimages.adobe.com/www.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-javascript-ref-2015.pdf)

### 6.3 photoshop脚本中文文档
[photoshop脚本中文文档](https://gitee.com/code_yu/photoshop-javascript)