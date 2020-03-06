---
title: Netty基本概念和体系结构
date: 2020-03-05
sidebar: 'auto'
type: 'classify'
categories:
 - Netty
tags:
 - Netty
 - JAVA
 - 网络框架
publish: true

---

## 网络编程

在JAVA体系，我们对网络编程提供了相关API，我们可以直接调用来解决实际问题，而无需关注底层通讯细节。

java.net 包中提供了两种常见的网络协议的支持：

- **TCP**：TCP 是传输控制协议的缩写，它保障了两个应用程序之间的可靠通信。通常用于互联网协议，被称 TCP / IP。
- **UDP**：UDP 是用户数据报协议的缩写，一个无连接的协议。提供了应用程序之间要发送的数据的数据包。

<!-- more -->

### Socket编程

套接字使用TCP提供了两台计算机之间的通信机制。 客户端程序创建一个套接字，并尝试连接服务器的套接字。

当连接建立时，服务器会创建一个 Socket 对象。客户端和服务器现在可以通过对 Socket 对象的写入和读取来进行通信。

**java.net.Socket** 类代表一个套接字，并且 **java.net.ServerSocket** 类为服务器程序提供了一种来监听客户端，并与他们建立连接的机制。

以下步骤在两台计算机之间使用套接字建立TCP连接时会出现：

- 服务器实例化一个 **ServerSocket**对象，表示通过服务器上的端口通信。
- 服务器调用 ServerSocket 类的 **accept()** 方法，该方法将一直等待，直到客户端连接到服务器上给定的端口。
- 服务器正在等待时，一个客户端实例化一个 Socket 对象，指定服务器名称和端口号来请求连接。
- Socket 类的构造函数试图将客户端连接到指定的服务器和端口号。如果通信被建立，则在客户端创建一个 Socket 对象能够与服务器进行通信。
- 在服务器端，accept() 方法返回服务器上一个新的 socket 引用，该 socket 连接到客户端的 socket。

连接建立后，通过使用 I/O 流在进行通信，每一个socket都有一个输出流和一个输入流，客户端的输出流连接到服务器端的输入流，而客户端的输入流连接到服务器端的输出流。

TCP 是一个**双向**的通信协议，因此数据可以通过两个数据流在同一时间发送.以下是一些类提供的一套完整的有用的方法来实现 socket。

![](http://github.img.junwangit.com/img/微信截图_20200306203318.png)

实例：

#### Socket 客户端实例

```java
package com.junwangit.netty.client;

import lombok.extern.slf4j.Slf4j;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

/**
 * @description: 说明描述
 * @author: hanfeng
 * @date: 2020-3-6
 **/
@Slf4j
public class SocketClient {

    /**
     * 客户端推送消息
     *
     * @param host
     * @param port
     */
    public void push(String host, int port) {
        try {
            Socket client = new Socket(host, port);
            log.debug("远程主机地址：{}", client.getRemoteSocketAddress());
            OutputStream outToServer = client.getOutputStream();
            DataOutputStream out = new DataOutputStream(outToServer);

            out.writeUTF("Hello from " + client.getLocalSocketAddress());
            InputStream inFromServer = client.getInputStream();
            DataInputStream in = new DataInputStream(inFromServer);
            log.debug("服务器响应：{}", in.readUTF());

            client.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}

```



#### Socket 服务端实例

```java
package com.junwangit.netty.server;

import lombok.extern.slf4j.Slf4j;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;

/**
 * @description: 说明描述
 * @author: hanfeng
 * @date: 2020-3-6
 **/
@Slf4j
public class SocketServer extends Thread {

    private ServerSocket serverSocket;

    public SocketServer(int port) throws IOException {
        serverSocket = new ServerSocket(port);
        serverSocket.setSoTimeout(100000);
    }

    @Override
    public void run() {
        while (true) {
            try {
                log.debug("等待远程连接，端口号为：{}", serverSocket.getLocalPort());
                Socket server = serverSocket.accept();
                log.debug("远程主机地址：{}", server.getRemoteSocketAddress());
                DataInputStream in = new DataInputStream(server.getInputStream());
                log.debug(in.readUTF());
                DataOutputStream out = new DataOutputStream(server.getOutputStream());
                out.writeUTF("感谢光临我的服务：" + server.getLocalSocketAddress());
                server.close();
            } catch (SocketTimeoutException s) {
                log.debug("Socket 连接超时");
                break;
            } catch (IOException e) {
                e.printStackTrace();
                break;
            }
        }
    }
}

```

启动服务

```java
package com.junwangit.netty.server;

import java.io.IOException;

/**
 * @description: 说明描述
 * @author: hanfeng
 * @date: 2020-3-6
 **/
public class StartSocket {
    public static void main(String[] args) {
        try {
            Thread t = new SocketServer(19090);
            t.run();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}

```

启动日志

```shell
21:06:40,068 |-INFO in ch.qos.logback.classic.joran.JoranConfigurator@10b48321 - Registering current configuration as safe fallback point
DEBUG 21:06:40.086 等待远程连接，端口号为：19090 
```

#### 单元测试

```java
package com.junwangit.netty;

import com.junwangit.netty.client.SocketClient;
import org.junit.Test;

/**
 * @description: 说明描述
 * @author: hanfeng
 * @date: 2020-3-6
 **/
public class SocketTest {

    @Test
    public void pushTest() {
        SocketClient client = new SocketClient();
        client.push("127.0.0.1", 19090);
    }
}

```

服务端响应

```shell
DEBUG 21:06:46.009 远程主机地址：/127.0.0.1:49321 
Hello from /127.0.0.1:49321
```

客户端响应

```shell
DEBUG 21:06:46.011 远程主机地址：/127.0.0.1:19090 
DEBUG 21:06:46.022 服务器响应：感谢光临我的服务：/127.0.0.1:19090 
```

实例源码：[netty-hello-world](https://github.com/junwangit/netty-guide/tree/master/netty-hello-world)

### JAVA NIO

Java NIO，全称 **Non-Block IO** ，是Java SE 1.4版以后，针对网络传输效能优化的新功能。是一种非阻塞同步的通信模式。

NIO 与原来的 I/O 有同样的作用和目的, 他们之间最重要的区别是**数据打包**和**传输的方式**。原来的 I/O 以**流**的方式处理数据，而 NIO 以**块**的方式处理数据。

面向流的 I/O 系统一次一个字节地处理数据。一个输入流产生一个字节的数据，一个输出流消费一个字节的数据。

面向块的 I/O 系统以块的形式处理数据。每一个操作都在一步中产生或者消费一个数据块。按块处理数据比按(流式的)字节处理数据要快得多。但是面向块的 I/O 缺少一些面向流的 I/O 所具有的优雅性和简单性。

核心组成：

- Channel：高速通道

  `**ServerSocketChannel`: 静态工厂方法`open`创建实例，`ServerSocketChannel`封装的`ServerSocket`还是`blocking IO`模式。`configureBlocking(false)`时，多路注册器`Selector`可用。

- Selector：多路注册器

  自身静态工厂方法`open`创建实例。通过`SelectorKey.OP_ACCEPT`注册`Selector`。

  ![](http://github.img.junwangit.com/img/20200306220621.png)

NIO模型优势

- 使用较少的线程就可以处理许多连接，可以减少内存管理和上下文切换带来的开销。
- 当没有I/O操作需要处理时，线程可以被用于其他任务。

NIOServer服务端：

```java
package com.junwangit.nio.server;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/**
 * @description: NIO服务端
 * @author: hanfeng
 * @date: 2020-3-6
 **/
@Slf4j
public class NIOServer {
    /**
     * 缓冲区，对应Channel的通信方式
     */
    private ServerSocketChannel server;
    /**
     * 服务默认端口
     */
    int port = 8080;
    /**
     * 多路注册复用器，注册SelectKey_OP各种操作事件
     */
    private Selector selector;
    /**
     * 接收缓冲池
     */
    ByteBuffer recBuffer = ByteBuffer.allocate(1024);
    /**
     * 发送缓冲池
     */
    ByteBuffer sendBuffer = ByteBuffer.allocate(1024);
    /**
     * 缓存机制
     */
    Map<SelectionKey, String> sessiomMsg = new HashMap<SelectionKey, String>();
    /**
     * 对客户端编号
     */
    private static int client_no = 19056;

    public NIOServer(int port) throws IOException {
        this.port = port;
        server = ServerSocketChannel.open();
        //底层就是一个ServerSocket
        server.socket().bind(new InetSocketAddress(this.port));
        server.configureBlocking(false);
        /**
         * 再将blocking设为false后，开启selector
         */
        selector = Selector.open();
        server.register(selector, SelectionKey.OP_ACCEPT);
        log.info("NIO消息服务器初始化完成，可以随时接收客户端链接，监听端口:{}", this.port);

    }

    /**
     * 我们需要用一个线程去监听selector，看上边是否有满足我们需要的事件类型SelectionKey
     *
     * @throws IOException
     */
    public void listener() throws IOException {
        while (true) {
            int evenCount = selector.select();
            if (evenCount == 0) {
                continue;
            }
            Set<SelectionKey> keys = selector.selectedKeys();
            //遍历并处理监听到selector中的事件
            final Iterator<SelectionKey> iteratorKeys = keys.iterator();
            while (iteratorKeys.hasNext()) {
                process(iteratorKeys.next());
                iteratorKeys.remove();

            }
        }
    }

    /**
     * 这里就是用来处理每一个SelectionKey：包含通道Channel信息 和 selector信息
     *
     * @param key
     */
    private void process(SelectionKey key) {
        SocketChannel client = null;
        try {
            if (key.isValid() && key.isAcceptable()) {
                client = server.accept();
                ++client_no;
                client.configureBlocking(false);
                client.register(selector, SelectionKey.OP_READ);
            } else if (key.isValid() && key.isReadable()) {
                //服务器从SocketChannel读取客户端发送过来的信息
                recBuffer.clear();
                client = (SocketChannel) key.channel();
                int len = client.read(recBuffer);
                if (len > 0) {
                    String msg = new String(recBuffer.array(), 0, len);
                    sessiomMsg.put(key, msg);
                    log.info("当前维护的线程ID:{},客户端编号为:{},信息为:{}" ,Thread.currentThread().getId(), client_no, msg);

                    //改变状态，又会被监听器监听到
                    client.register(selector, SelectionKey.OP_WRITE);
                }
            } else if (key.isValid() && key.isWritable()) {
                if (!sessiomMsg.containsKey(key)) {
                    return;
                }
                client = (SocketChannel) key.channel();
                //position=0
                sendBuffer.clear();
                //如position=500
                sendBuffer.put((sessiomMsg.get(key) + "你好，已经处理完请求！").getBytes());
                //limit=500 position=0 0-->limt
                sendBuffer.flip();
                client.write(sendBuffer);
                log.info("当前维护的线程ID:{},对客户端写信息,客户端编号为:{}" ,Thread.currentThread().getId(), client_no);
                //改变状态，又会被监听器监听到
                client.register(selector, SelectionKey.OP_READ);
            }
        } catch (IOException e) {
            //防止客户端非法下线
            key.cancel();
            try {
                client.socket().close();
                client.close();
                log.info("【系统提示】:{}", new SimpleDateFormat().format(new Date()) + sessiomMsg.get(key) + "已下线");
            } catch (IOException e1) {
                e1.printStackTrace();
            }
        }
    }

}

```

启动服务端

```java
package com.junwangit.nio.server;

import java.io.IOException;

/**
 * @description: 启动NIO服务
 * @author: hanfeng
 * @date: 2020-3-6
 **/
public class StartNIOServer {
    public static void main(String[] args) {
        try {
            new NIOServer(19090).listener();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```



NIOClient客户端

```java
package com.junwangit.nio.client;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Scanner;
import java.util.Set;

/**
 * @description: NIO客户端
 * @author: hanfeng
 * @date: 2020-3-6
 **/
@Slf4j
public class NIOClient {
    private SocketChannel client;

    InetSocketAddress serverAddress = new InetSocketAddress("localhost", 19090);

    private Selector selector;

    /**
     * 接收缓冲池
     */
    ByteBuffer recBuffer = ByteBuffer.allocate(1024);
    /**
     * 发送缓冲池
     */
    ByteBuffer sendBuffer = ByteBuffer.allocate(1024);

    public NIOClient() throws IOException {
        //构造client实例
        client = SocketChannel.open();

        client.configureBlocking(false);
        client.connect(serverAddress);

        //构造selector实例
        selector = Selector.open();

        //注册连接事件
        client.register(selector, SelectionKey.OP_CONNECT);
        //Netty Reactor线程池组 Tomcat bootstrap
    }

    public void session() throws IOException {

        if (client.isConnectionPending()) {
            client.finishConnect();

            client.register(selector, SelectionKey.OP_WRITE);

           log.info("已经连接到服务器，可以在控制台登记了");

        }

        Scanner sc = new Scanner(System.in);

        while (sc.hasNextLine()) {
            String msg = sc.nextLine();
            if ("".equals(msg)) {
                continue;
            }
            if ("exit".equals(msg)) {
                System.exit(0);
            }


            process(msg);

        }
    }

    private void process(String name) {
        boolean waitHelp = true;
        Iterator<SelectionKey> iteratorKeys = null;
        Set<SelectionKey> keys = null;
        while (waitHelp) {
            try {

                int readys = selector.select();

                //如果没有客人，继续轮询
                if (readys == 0) {
                    continue;
                }

                keys = selector.selectedKeys();
                iteratorKeys = keys.iterator();

                //一个个迭代keys
                while (iteratorKeys.hasNext()) {
                    SelectionKey key = iteratorKeys.next();

                    if (key.isValid() && key.isWritable()) {

                        //可写就是客户端要对服务器发送信息
                        sendBuffer.clear();
                        sendBuffer.put(name.getBytes());
                        sendBuffer.flip();
                        client.write(sendBuffer);
                        client.register(selector, SelectionKey.OP_READ);
                    } else if (key.isValid() && key.isReadable()) {
                        //服务器发送信息回来，给客户端读
                        recBuffer.clear();
                        int len = client.read(recBuffer);
                        if (len > 0) {
                            recBuffer.flip();
                            log.info("服务器返回的消息是: 当前维护的线程ID:{},对客户端写信息:{}" ,Thread.currentThread().getId(), new String(recBuffer.array(), 0, len));

                            //改变状态，又会被监听器监听到
                            client.register(selector, SelectionKey.OP_WRITE);

                            waitHelp = false;
                        }
                    }
                    //检查完之后，打发客户走
                    iteratorKeys.remove();
                }

            } catch (IOException e) {
                //防止客户端非法下线
                ((SelectionKey) keys).cancel();
                try {
                    client.socket().close();
                    client.close();
                    return;
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }

        }

    }
}

```

启动客户端

```java
package com.junwangit.nio.client;

import java.io.IOException;

/**
 * @description: 说明描述
 * @author: hanfeng
 * @date: 2020-3-6
 **/
public class StartNIOClient {
    public static void main(String[] args) {
        try {
            new NIOClient().session();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

日志：

```
22:03:22,359 |-INFO in ch.qos.logback.classic.joran.JoranConfigurator@27abe2cd - Registering current configuration as safe fallback point
INFO  22:03:23.096 NIO消息服务器初始化完成，可以随时接收客户端链接，监听端口:19090 
INFO  22:03:51.185 当前维护的线程ID:1,客户端编号为:19057,信息为:junwangit 
INFO  22:03:51.186 当前维护的线程ID:1,对客户端写信息,客户端编号为:19057 

## 客户端
INFO  22:03:44.984 已经连接到服务器，可以在控制台登记了 
junwangit
INFO  22:03:51.186 服务器返回的消息是: 当前维护的线程ID:1,对客户端写信息:junwangit你好，已经处理完请求！ 
```

# Netty

> [Netty](https://netty.io/)是一款异步的事件驱动的**网络**应用程序框架，支持快速地开发可维护的**高性能**的面向协议的服务器和客户端。

## 核心组件



### Channel

Channel是JAVA NIO的基本构造。

可以把 Channel 看作是传入（入站）或者传出（出站）数据的载体。因此，它可以
被打开或者被关闭，连接或者断开连接。  

### 回调

Netty 在内部使用了回调来处理事件；当一个回调被触发时，相关的事件可以被一个 `interfaceChannelHandler` 的实现处理。  

### Future

Future 提供了另一种在操作完成时通知应用程序的方式。这个对象可以看作是一个异步操作的结果的占位符；它将在未来的某个时刻完成，并提供对其结果的访问。  

JDK 预置了` interface java.util.concurrent.Future`，但是其所提供的实现，只允许手动检查对应的操作是否已经完成，或者一直阻塞直到它完成。这是非常繁琐的，所以 Netty提供了它自己的实现——`ChannelFuture`，用于在执行异步操作的时候使用。  

ChannelFuture提供了几种额外的方法，这些方法使得我们能够注册一个或者多个`ChannelFutureListener`实例。监听器的回调方法`operationComplete()`， 将会在对应的操作完成时被调用 。然后监听器可以判断该操作是成功地完成了还是出错了。如果是后者，我们可以检索产生的Throwable。  

### 事件和ChannelHandler

Netty 使用不同的事件来通知我们状态的改变或者是操作的状态。  

- 记录日志；

- 数据转换；

- 流控制；

- 应用程序逻辑  


Netty 是一个网络编程框架，所以事件是按照它们与入站或出站数据流的相关性进行分类的。
可能由入站数据或者相关的状态更改而触发的事件包括：

-  连接已被激活或者连接失活；  
- 数据读取；  
- 用户事件；  
- 错误事件。

出站事件是未来将会触发的某个动作的操作结果，这些动作包括  

- 打开或者关闭到远程节点的连接  
- 将数据写到或者冲刷到套接字。  

每个事件都可以被分发给 ChannelHandler 类中的某个用户实现的方法。这是一个很好的将事件驱动范式直接转换为应用程序构件块的例子。  

### Netty简单实例

**服务端**

```java
package com.junwangit.netty.server;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.CharsetUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * @description: 服务入站事件处理
 * @author: hanfeng
 * @date: 2020-3-6
 **/
@Slf4j
@ChannelHandler.Sharable
public class EchoServerHandler extends ChannelInboundHandlerAdapter {
    /**
     * 数据接收
     * @param ctx
     * @param msg
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf in = (ByteBuf) msg;
        log.info("服务接收到数据：{} ", in.toString(CharsetUtil.UTF_8));
        // 回应消息
        ctx.write(Unpooled.copiedBuffer("我是Netty服务，我已经收到消息,马上给你办理",
                CharsetUtil.UTF_8));
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx)
            throws Exception {
        ctx.writeAndFlush(Unpooled.EMPTY_BUFFER)
                .addListener(ChannelFutureListener.CLOSE);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
                                Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}

```

Echo 服务器会响应传入的消息，所以它需要实现 `ChannelInboundHandler` 接口， 用来定义响应入站事件的方法。  

继承 `ChannelInboundHandlerAdapter` 类也就足够了， 它提供了 `ChannelInboundHandler` 的默认实现。  

- **channelRead()**  对于每个传入的消息都要调用；
- **channelReadComplete()**  通知`ChannelInboundHandler`最后一次对`channelRead()`的调用是当前批量读取中的最后一条消息；
- **exceptionCaught()**  在读取操作期间， 有异常抛出时会调用。  

**服务启动引导**

```java
package com.junwangit.netty.server;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import lombok.extern.slf4j.Slf4j;

import java.net.InetSocketAddress;

/**
 * @description: 说明描述
 * @author: hanfeng
 * @date: 2020-3-6
 **/
@Slf4j
public class EchoServer {
    private final int port;

    public EchoServer(int port) {
        this.port = port;
    }

    public static void main(String[] args)
            throws Exception {
        // 指定服务端口
        new EchoServer(19090).start();
    }

    public void start() throws Exception {
        final EchoServerHandler serverHandler = new EchoServerHandler();
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(group)
                    .channel(NioServerSocketChannel.class)
                    .localAddress(new InetSocketAddress(port))
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) throws Exception {
                            ch.pipeline().addLast(serverHandler);
                        }
                    });

            ChannelFuture f = b.bind().sync();
            log.info("{} started and listening for connections on{} ", EchoServer.class.getName(), f.channel().localAddress());
            f.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully().sync();
        }
    }
}

```

启动引导主要作用

- 绑定到服务器将在其上监听并接受传入连接请求的端口；

- 配置 Channel，以将有关的入站消息通知给 EchoServerHandler 实例  

**客户端**

```java
package com.junwangit.netty.client;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.util.CharsetUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * @description: 说明描述
 * @author: hanfeng
 * @date: 2020-3-6
 **/
@Slf4j
@ChannelHandler.Sharable
public class EchoClientHandler
        extends SimpleChannelInboundHandler<ByteBuf> {
    /**
     * 在到服务器的连接已经建立之后将被调用；
     * @param ctx
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        ctx.writeAndFlush(Unpooled.copiedBuffer("我需要XXX数据，麻烦提供！",
                CharsetUtil.UTF_8));
    }

    /**
     * 当从服务器接收到一条消息时被调用
     * @param ctx
     * @param in
     */
    @Override
    public void channelRead0(ChannelHandlerContext ctx, ByteBuf in) {
        log.info("客户端接收到消息：{}", in.toString(CharsetUtil.UTF_8));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx,
                                Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}
```

客户端将拥有一个用来处理数据的 ChannelInboundHandler。  

- **channelActive()**  在到服务器的连接已经建立之后将被调用  
- **channelRead0()**  当从服务器接收到一条消息时被调用；  
- **exceptionCaught()**  在处理过程中引发异常时被调用。  

**引导客户端**

```java
package com.junwangit.netty.client;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;

import java.net.InetSocketAddress;

/**
 * @description: 说明描述
 * @author: hanfeng
 * @date: 2020-3-6
 **/
public class EchoClient {
    private final String host;
    private final int port;

    public EchoClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public void start()
            throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap b = new Bootstrap();
            b.group(group)
                    .channel(NioSocketChannel.class)
                    .remoteAddress(new InetSocketAddress(host, port))
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch)
                                throws Exception {
                            ch.pipeline().addLast(
                                    new EchoClientHandler());
                        }
                    });
            ChannelFuture f = b.connect().sync();
            f.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully().sync();
        }
    }

    public static void main(String[] args)
            throws Exception {
        new EchoClient("127.0.0.1", 19090).start();
    }
}

```

客户端是使用主机和端口参数来连接远程地址 。

客户端主要操作

- 为初始化客户端， 创建了一个 Bootstrap 实例；  
- 为进行事件处理分配了一个 NioEventLoopGroup 实例， 其中事件处理包括创建新的连接以及处理入站和出站数据；
- 为服务器连接创建了一个 InetSocketAddress 实例；
- 当连接被建立时，一个 EchoClientHandler 实例会被安装到（该 Channel 的）ChannelPipeline 中；
- 在一切都设置完成后，调用 Bootstrap.connect()方法连接到远程节点；  

测试结果：

```shell
# 服务端
DEBUG 23:34:01.480 Loaded default ResourceLeakDetector: io.netty.util.ResourceLeakDetector@1b103c49 
INFO  23:34:01.488 服务接收到数据：我需要XXX数据，麻烦提供！  

# 客户端
DEBUG 23:34:01.434 Loaded default ResourceLeakDetector: io.netty.util.ResourceLeakDetector@af3b1c2 
DEBUG 23:34:01.443 -Dio.netty.recycler.maxCapacityPerThread: 4096 
DEBUG 23:34:01.443 -Dio.netty.recycler.maxSharedCapacityFactor: 2 
DEBUG 23:34:01.444 -Dio.netty.recycler.linkCapacity: 16 
DEBUG 23:34:01.444 -Dio.netty.recycler.ratio: 8 
INFO  23:34:01.502 客户端接收到消息：我是Netty服务，我已经收到消息,马上给你办理 
```

实例源码：[netty-echo](https://github.com/junwangit/netty-guide/tree/master/netty-echo)