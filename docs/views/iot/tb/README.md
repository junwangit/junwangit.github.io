---
title: Thingsboard平台介绍
date: 2020-03-05
sidebar: 'auto'
type: 'classify'
categories:
 - ThingsBoard
tags:
 - IOT
 - 物联网
 - ThingsBoard
publish: true
sticky: 1
---

# Thingsboard 平台

[ThingsBoard](https://thingsboard.io/)是一个开源物联网平台，可实现物联网项目的快速开发、管理和扩展。我们可以基于本地解决方案为IOT应用程序服务端基础架构。

## 特点

- 管理设备，资产和客户并定义他们之间的关系。
- 基于设备和资产收集数据并进行可视化。
- 采集遥测数据并进行相关的事件处理进行警报响应。
- 基于远程RPC调用进行设备控制。
- 基于生命周期事件、REST API事件、RPC请求构建工作流。
- 基于动态设计和响应仪表板向你的客户提供设备或资产的遥测数据。
- 基于规则链自定义特定功能。
- 发布设备数据至第三方系统。
- 更多…

Thingsboard分为专业版和社区版，社区版是开源的，专业版是收费的。

### 社区版功能

- 属性 - 为你的自定义实体分配键值属性（例如配置，数据处理，可视化参数）的平台功能。
- 遥测 - 采集时间序列和相关API用例数据。
- 实体和关系 - 创建物理模型对象（例如设备和资产）及它们之间的关系 。
- 数据可视化 - 可视化功能: 部件, 仪表板, 仪表板状态。
- 规则引擎 - 对传入的遥测、事件执行相关处理和操作。
- RPC - 从你的应用程称推送API和部件命令至设备，亦可反向推送 。
- 审计日志 - 记录用户行为和API调用情况。
- API限制 - 控制在指定时间内主机对API的请求情况。

### 专业版功能

- White标签 - 配置产品徽标、配色方案和邮件模板
- 平台集成 - 使用NB IoT，LoRaWAN和SigFox，特定payload格式或各种IoT平台等连接解决方​​案连接设备。
    - HTTP
    - MQTT
    - OPC-UA
    - SigFox
    - ThingPark
    - TheThingsNetwork
    - Azure Event Hub
    - IBM Watson IoT
    - AWS IoT
- 设备 & 资产组 -配置多个自定义设备和资产组。
- 计划任务 - 使用计划任务配置各种事件 (配置更新, 生成报告, rpc命令)。
- 报告 - 使用现有的仪表板生成报告，并通过电子邮件将其分发给最终用户。
- 导出CSV/XLS - 从部件导出CSV或者XLS文件。
- 文件存储 - 在数据库中保存二进制的能力。

## 架构

ThingsBoard设计为:

- 可扩展: 使用领先开源技术构建的可水平扩展平台。
- 容错：无单点故障，集群中的每个节点都是相同的。
- 性能卓越：单个服务器节点可以根据用例处理几十甚至数十万个设备。ThingsBoard集群可以处理数百万台设备。
- 灵活：开发新功能可以方便的使用自定义部件、规则引擎等。
- 持久：数据永久保存

[单体架构](https://thingsboard.io/) [微服务架构](https://thingsboard.io/)

## 博文目录

### 基础篇

[1、万物互联-Thingsboard-本地调试环境搭建](1-thingsboadr-local-environment.md)

[2、万物互联-Thingsboard-项目结构说明](2-project-structure-description.md)

### 高级篇

### 进阶篇

