---
title: Gitflow工作流
date: 2020-02-11
tags:
 - gitflow
 - git
categories: 
 - git
---

# Gitflow工作流介绍

Gitflow工作流仍然用中央仓库作为所有开发者的交互中心，这和其它git的工作流一样，开发者在本地开发并push分支到要中央仓库中。Gitflow工作流定义了一个围绕项目发布的严格分支模型，它提供了用于一个健壮的用于管理大型项目的框架。

![](http://github.img.junwangit.com/img/20200211204806.png)

Gitflow工作流没有用超出**功能分支工作流**的概念和命令，它为不同的分支分配一个很明确的角色，并定义分支之间在什么时候怎样进行交互。下面对各个分支的作用进行说明，也有一个例子用来介绍分支之间具体如何交互。


##  历史分支

Gitflow工作流使用2个分支来记录项目的历史。master分支存储了正式发布的历史，而develop分支作为功能的集成分支。这样也方便master分支上的所有提交分配一个版本号。

![](http://github.img.junwangit.com/img/20200211205318.png)

## 功能分支

每个新功能都有一个自己的专属分支，这样可以push到中央仓库备份和协作。但功能分支并不是基于master而创建的分支，而是使用develop分支作为父分支。当新功能完成时需要合并回develop分支，它不应该直接与master交互。

![](http://github.img.junwangit.com/img/20200211205351.png)

最佳实践：

- 基于 **develop** 发展
- 必须合并回到 **develop**
- 分支命名规范 **master**，**develop**， **feature/xxx**，**release/xxx**，**hotfix/xxx** 

## 发布分支

当develop分支上有做了一次合并或者是积攒了足够功能，就从develop分支上fork一个发布分支。新建的这个分支用于发布代码，所以从这个时间点开始之后新的功能不能再加到这个分支上，这个分支只能修改Bug和其它面向发布的任务。一旦对外发布的工作都完成了，发布分支合并到master分支并分配一个版本号打好Tag。另外，这些从新建发布分支以来的做的修改要合并回develop分支。

![](http://github.img.junwangit.com/img/20200211205530.png)

使用一个用于发布准备的专门分支，使得一个团队可以在完善当前的发布版本的同时，另一个团队可以继续开发下个版本的功能。

这也制定了一个良好的开发阶段（比如，可以很轻松地说『这周我们要准备发布版本4.0』），并且在仓库的目录结构中可以实际看到

## 维护分支

维护分支或说是热修复（hotfix）分支用于生成快速给产品发布版本（production releases）打补丁，这是唯一可以直接从master分支fork出来的分支。修复完成，修改应该马上合并回master分支和develop分支（当前的发布分支），master分支应该用新的版本号打好Tag。

![](http://github.img.junwangit.com/img/20200211205617.png)

为Bug修复使用专门分支，让团队可以处理掉问题而不用打断其它工作或是等待下一个发布循环。你可以把维护分支想成是一个直接在master分支上处理的临时发布。

# 实例

​		下面的示例演示本工作流如何用于管理单个发布循环。假设你已经创建了一个中央仓库，我们模拟几位同事运用gitflow工作流协作。

## 创建开发分支

![](http://github.img.junwangit.com/img/20200211210646.png)

基于master分支创建一个develop分支。可以先在本地创建一个空的develop分支，然后push到服务器上：

```
git branch develop
git push -u origin develop
```

以后这个分支将会包含了项目的全部历史，而master分支将只包含了部分历史。其它开发者这时应该克隆中央仓库，建好develop分支的跟踪分支（即本地develop与远程develop进行关联）：

```
git clone ssh://user@host/path/to/repo.git
git checkout -b develop origin/develop
```

上面由项目管理者操作即可，而每个开发人员应该从下面的流程开始，我们假充有两位同事：张三和李四。

## 开发者开发各自的新功能

![](http://github.img.junwangit.com/img/20200211210829.png)

这两位同事负责开发独立的功能，首先他们需要为各自的功能创建相应的分支。新分支不是基于master分支，而应该基于develop分支：

```
# 张三
git checkout -b 0.1.0 develop

# 李四
git checkout -b 0.1.1 develop
```

他们在各自创建的分支上编写代码，在开发过程中陆续有代码提交到本地仓库的功能分支。

```
git status
git add --all
git commit -m 'something...'
```

## 张三完成功能开发

![](http://github.img.junwangit.com/img/20200211210948.png)

张三在开发过程中会有多次提交，当他确认功能开发完毕后可以直接合并到本地的develop分支，并且push到中央仓库。如果团队使用Pull Requests，这时候也可以发起一个用于合并变更到develop分支申请。

```
git pull origin develop
git checkout develop
git merge 0.1.0
git push
git branch -d 0.1.0
```

第一条命令确保在合并前develop分支是最新的。要特别注意的是功能分支上的代码决不应该直接合并到master分支。在合并过程中可能会有冲突，解决方法的思路和SVN是类似的。

## 张三开始准备发布

![](http://github.img.junwangit.com/img/20200211211125.png)

这个时候李四还在实现他的功能，张三已经准备他第一个项目正式发布。像功能开发一样，他用一个新的分支来做发布准备。这一步也确定了发布的版本号：

```
git checkout -b release-0.1.0 develop
```

这个分支是清理发布、执行所有测试、更新文档和其它为下个发布做准备操作的地方，像是一个专门用于改善发布的功能分支。只要张三创建这个分支并push到中央仓库，这个发布就是功能冻结的。任何不在develop分支中的新功能都推到下个发布循环中。

## 张三完成发布

![](http://github.img.junwangit.com/img/20200211211304.png)

一旦准备好了对外发布，张三合并修改到master分支和develop分支上，并且删除发布分支。合并回develop分支很重要，因为在发布分支中已经提交的更新需要在后面的新功能中也是必须的。另外，如果张三的团队要求Code Review，这是一个发起Pull Request的理想时机。

```
git checkout master
git merge release-0.1.0
git push
git checkout develop
git merge release-0.1.0
git push
git branch -d release-0.1.0
```

发布分支是作为功能开发（develop分支）和对外发布（master分支）间的缓冲。只要有合并到master分支，就应该打好Tag以方便跟踪。

```
git tag -a v0.1.0 -m "Initial public release" master
git push --tags
```

Git有提供各种勾子（hook），即仓库有事件发生时触发执行的脚本。可以配置一个勾子，在你push中央仓库的master分支时，自动构建好对外发布。

## 用户发现Bug

![](http://github.img.junwangit.com/img/20200211211451.png)

版本对外发布后，张三回去和李四一起做下个版本的新功能开发，直到有用户开了一个Ticket抱怨当前版本的一个Bug。为了处理Bug，张三（或李四）从master分支上拉出了一个维护分支，提交修改以解决问题，然后直接合并回master分支：

```
git checkout -b issue-#001 master
# Fix the bug
git checkout master
git merge issue-#001
git push
```

就像发布分支，维护分支中新加这些重要修改需要包含到develop分支中，所以张三要执行一个合并操作。然后就可以安全地删除这个分支了：

```
git checkout develop
git merge issue-#001
git push
git branch -d issue-#001
```



##  可视化客户端

- Sourcetree ([官网](https://www.sourcetreeapp.com/))
- TortoiseGit （[官网](https://tortoisegit.org/)）