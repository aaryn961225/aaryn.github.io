# rain = input("今日是否下雨：")
# if rain == "有":
#     print("撐傘出門")
#     print("買一包洋芋片")
#     print("在家看電影")
# else:
#     print("耍廢")

# w1
# def helper(a, b):
#     return a + b


# def main():
#     result = help(3, 5)
#     print(result)


# if __name__ == "__main__":
#     main()

# w2
# def sub(a, b):
#     return a + b


# def main():
#     a = int(input("請輸入第一個數字: "))
#     b = int(input("請輸入第二個數字: "))
#     result = sub(a, b)
#     print(result)


# if __name__ == "__main__":
#     main()


# w3
# def sub(a, b):
#     return a + b


# def main(a, b):
#     result = sub(a, b)
#     print(result)


# if __name__ == "__main__":
#     main(2, 3)

# **-----找最大值------**
# nums = [3, 7, 2, 9]
# ans = nums[0]
# for x in nums:
#     if x > ans:
#         ans = x
# print(ans)


def sub(arr):
    max = arr[0]
    for x in arr:
        if x > max:
            max = x
    return max


def main(arr):
    result = sub(arr)
    print(result)


if __name__ == "__main__":
    arr = [3, 7, 2, 9, 5]
    main(arr)


# **-----計算出現次數------**
# nums = [1, 2, 2, 3, 1]
# count = {}
# for x in nums:
#     # if x in count:
#     #     count[x] += 1
#     # else:
#     #     count[x] = 1
#     count[x] = count.get(x, 0) + 1
# print(count)
