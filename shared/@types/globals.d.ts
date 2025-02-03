declare type integer = number & { __int__: never };
declare type float = number & { __float__: never };

declare type stringed<T = any> = string & { __: T };

declare type timestamp = number; // 1648812919916
declare type yearFull = number; // 1975
declare type monthNum = number; // 09
declare type day = number; // 02
declare type hour = number; // 06
declare type minute = number; // 05
declare type seconds = number; // 09
declare type milliseconds = number; // 352
declare type datetime = `${yearFull}.${monthNum}.${day}T${hour}:${minute}:${seconds}.${milliseconds}Z`;
