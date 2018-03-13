const MyChatError = require('./MyChatError');

async function merge(a1, a2) {
    if (!a1 && !a2) {
        return undefined;
    }
    if (!a2) {
        return a1;
    }
    if (!a1) {
        return a2;
    }
    if (a1.search(a2) != -1) {
        throw new MyChatError(2, "要添加的属性已经包含在其中");
    }
    else {
        return [a1,a2].join(",");
    }
}

async function remove(a1, a2) {
    if (!a1) {
        console.log("a = " + a1 + " b = " + a2);
        throw new MyChatError(2, "试图从空属性值中删除属性");
    }
    if (!a2) {
        return a1;
    }
    if (a1.search(a2) === -1) {
        console.log("a = " + a1 + " b = " + a2);
        throw new MyChatError(2, "属性值中不包含此要删除属性")
    }
    else {
        let array1 = a1.split(',');
        let array2 = a2.split(',');
        let newAttribute = [];
        array1.forEach(function(e) {
            if (array2.indexOf(e) === -1)
                newAttribute.push(e);
        })
        return newAttribute.join(',');
    }
}

// test code
// const array = "0c83f57c786a0b4a39efab23731c7ebc,1c0b76fce779f78f51be339c49445c49,77e73f3a185e16d1f08ca5e057710b9d,fc46e26a907870744758b76166150f62";
//
// async function test() {
//     try {
//     let r1 = await merge(array, undefined);
//     console.log(r1);
//     let r2 = await remove(array, array.split(',')[0]);
//     console.log(r2);
//     let r3 = await merge(array, array.split(','[0]));
//     console.log(r3);
//   }
//   catch(e) {
//       console.log(e);
//   }
// }

exports = module.exports = {
    merge,
    remove
};
