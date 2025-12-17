---
title: 记STM点亮LED
date: 2025-12-10
categories: STM32
---

记录菜鸟的STM32点灯实验，这里使用的是标准库

## 第一步：硬件准备
STM32F103C8T6 最小系统板 (Blue Pill)

ST-Link V2 下载器

杜邦线若干

### 第二步：编写代码

Keil uVision 5 (MDK-ARM)中对main.c进行代码编写：
```bash
#include "stm32f10x.h"

// 简单的软件延时函数
void Delay_ms(uint32_t time)
{
    uint32_t i, j;
    for (i = 0; i < time; i++)
        for (j = 0; j < 10000; j++); // 粗略延时，具体数值取决于主频
}

void LED_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStructure;

    // 1. 开启 GPIOC 的时钟 (PC13 在 GPIOC 上)
    // 注意：STM32F10x 的 GPIO 挂载在 APB2 总线上
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOC, ENABLE);

    // 2. 配置引脚参数
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_13;        // 选择 13 号引脚
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;  // 推挽输出模式 (Push-Pull)
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz; // 输出速度 50MHz

    // 3. 初始化 GPIOC
    GPIO_Init(GPIOC, &GPIO_InitStructure);
}

int main(void)
{
    // 初始化 LED
    LED_Init();

    while (1)
    {
        // PC13 接的是 LED 负极，所以低电平点亮
        
        // 方式一：设置低电平 (点亮)
        GPIO_ResetBits(GPIOC, GPIO_Pin_13); 
        Delay_ms(500); // 延时

        // 方式二：设置高电平 (熄灭)
        GPIO_SetBits(GPIOC, GPIO_Pin_13);
        Delay_ms(500); // 延时
    }
}
```