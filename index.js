const readline = require('readline');

const dict = new Map();

dict.set('a_test', new Set(['a value', 'an other value']));
dict.set('a_nother', new Set(['a value2', 'an other value']));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Pick Something: '
});

const exit = () => {
  console.log('\nGoodbye!');
  process.exit(0);
}

const unRecognized = () => {
  console.log('Unrecognized Command - Please type OPTIONS to see a list of commands.');
}

const specficUnRecognized = (commandType, correction) => {
  console.log(`Inncorrect format for ${commandType}: please ${correction}.`)
}

const keys = (length) => {
  if (length === 1) {
    if (dict.size) {
      let i = 1;
      for (let key of dict.keys()) {
        console.log(`${i}.) ${key}`)
        i++;
      }
    } else {
      console.log('There are no keys.')
    }
  } else {
    specficUnRecognized('KEYS', 'do not provide any additional arguments')
  }
}

const members = (values) => {
  if (values.length === 2) {
    const target = values[1]
    const results = dict.get(target);
    if (results) {
      if (results.size) {
        let i = 1;
        for (let item of results) {
          console.log(`${i}.) ${item}`)
          i++;
        }
      } else {
        console.log(`No Members found for ${target}.`)
      }
    } else {
      console.log(`${target} key does not exist.`);
    }
  } else {
    specficUnRecognized('MEMBERS', 'use the syntax MEMBERS [key_name]')
  }
}

const add = (values) => {
  if (values.length >= 3) {
    const targetKey = values[1];
    const targetSet = dict.get(targetKey);
    const newEntry = values.splice(2).join(' ');

    if (targetSet) {
      if (targetSet.has(newEntry)) {
        console.log(`Not Added: ${newEntry} already exists for ${targetKey}.`);
      } else {
        dict.set(targetKey, targetSet.add(newEntry));
        console.log(`${newEntry} added to ${targetKey}`);
      }
    } else {
      dict.set(targetKey, new Set([newEntry]));
      console.log(`${newEntry} added to newly created key ${targetKey}.`);
    }
  } else {
    specficUnRecognized('ADD', 'use the syntax ADD [key_name] [your value string]');
  }
}

const remove = (values) => {
  if (values.length >= 3) {
    const targetKey = values[1];
    const targetSet = dict.get(targetKey);
    const targetEntry = values.splice(2).join(' ');

    if (targetSet) {
      if (targetSet.has(targetEntry)) {
        targetSet.delete(targetEntry);
        if (targetSet.size === 0) {
          dict.delete(targetKey);
          console.log(`${targetEntry} was the last item in ${targetKey} - key is now deleted as well.`);
        } else {
          dict.set(targetKey, targetSet);
          console.log(`${targetEntry} removed from ${targetKey}.`);
        }
      } else {
        console.log(`ERROR, value ${targetEntry} does not exist on ${targetKey}.`);
      }
    } else {
      console.log(`ERROR, key ${targetKey} does not exist.`);
    }
  } else {
    specficUnRecognized('REMOVE', 'use the syntax REMOVE [key_name] [your value string]');
  }
}

const removeAll = (values) => {
  if (values.length == 2) {
    const targetKey = values[1];
    if (dict.has(targetKey)) {
      dict.delete(targetKey);
      console.log(`The key ${targetKey} and all associated values were deleted.`);
    } else {
      console.log(`ERROR, key ${targetKey} does not exist.`);
    }
  } else {
    specficUnRecognized('REMOVEALL', 'use the syntax REMOVE [key_name]');
  }
}

const clear = (length) => {
  if (length === 1) {
   dict.clear();
   console.log('Entire Dictonary Cleared.');
  } else {
    specficUnRecognized('KEYS', 'do not provide any additional arguments')
  }
}

const keyExists = (values) => {
  if (values.length == 2) {
    console.log(dict.has(values[1]));
  } else {
    specficUnRecognized('KEYEXISTS', 'use the syntax KEYEXISTS [key_name]');
  }
}

const valueExists = (values) => {
  if (values.length >= 3) {
    const targetKey = values[1];
    const targetSet = dict.get(targetKey);
    const targetEntry = values.splice(2).join(' ');
    console.log(!!(targetKey && targetSet && targetSet.has(targetEntry)));
  } else {
    specficUnRecognized('VALUEEXISTS', 'use the syntax VALUEEXISTS [key_name] [your value string]');
  }
}

const allMembers = (length, itemMode = false) => {
  if (length === 1) {
    if (dict.size) {
      let i = 1;
      for (let key of dict.keys()) {
        const targetSet = dict.get(key);
        for (let item of targetSet) {
          console.log(`${i}.) ${itemMode ? `${key}: ` : ''}${item}`)
          i++;
        }
      }
    } else {
      console.log('Dictonary is Empty')
    }
  } else {
    specficUnRecognized(itemMode ? 'ITEMS' : 'ALLMEMBERS', 'do not provide any additional arguments')
  }
}

const options = (length) => {
  if (length === 1) {
   console.log(`
      KEYS - Display All Keys in the dictonary. No additional arguments required.
      MEMBERS - Display members for a given key. (Ex: MEMBERS your_key).
      ADD - Add a member to a given key. (Ex: ADD your_key your spaced string value).
      REMOVE - Remove a value from a key. (Ex: REMOVE your_key your spaced string value).
      REMOVEALL - Remove all values from a key. (Ex: REMOVE your_key).
      CLEAR - Clears entire content of dictonary. No additional arguments required.
      KEYEXISTS - States whether or not a key is present. (Ex: KEYEXISTS your_key).
      VALUEEXISTS - States whether or not a value is present for a key. (Ex: VALUEEXISTS your_key your spaced string value).
      ALLMEMEMBERS - Displays all values in dictonary. No additional arguments required.
      ITEMS - Displays all key value pairs in dictonary. No additional arguments required.
   `)
  } else {
    specficUnRecognized('OPTIONS', 'do not provide any additional arguments')
  }
}

console.log('Welcome to a CLI Dictonary Tool - Type Options for a List of Commands or if you know what you wanna do just get started.')
rl.prompt();

rl.on('line', (line) => {
  const res = line.trim().split(' ');
  switch (res[0]) {
    case 'KEYS':
      keys(res.length);
      break;
    case 'MEMBERS':
      members(res);
      break;
    case 'ADD':
      add(res);
      break;
    case 'REMOVE':
      remove(res);
      break;
    case 'REMOVEALL':
      removeAll(res);
      break;
    case 'CLEAR':
      clear(res.length);
      break;
    case 'KEYEXISTS':
      keyExists(res);
      break;
    case 'VALUEEXISTS':
      valueExists(res);
      break;
    case 'ALLMEMBERS':
      allMembers(res.length);
      break;
    case 'ITEMS':
      allMembers(res.length, true);
      break;
    case 'OPTIONS':
      options(res.length);
      break;
    case 'exit':
      exit();
      break;
    default:
      unRecognized();
      break;
  }
  rl.prompt();
}).on('close', () => {
  exit();
});

