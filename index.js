const classes = {};

function today(os){
  const offset = os ? parseInt(os) : 0;
  const dt = new Date();
  const date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + offset, 0, 0, 0);
  return parseInt(date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0"));
}

const fns = {
  today: today
}

function present(obj){
  return !!obj;
}

function expandInput(input){
  const [named, ...args] = input.split(" ");
  const fn = fns[named];
  return fn ? fn.apply(null, args) : input;
}

function match(patterns){
  return function(block){
    for(let pattern of patterns){
      if (!pattern.test(block.content)){
        return false;
      }
    }
    return true;
  }
}

async function findIds(qu){
  const {query, inputs, matches} = qu;
  let q = query, ins = inputs.map(expandInput);
  for(let i in ins){
    q = q.replace(new RegExp(`\\{${i}\\}`, "gi"), ins[i]);
  }
  const queried = await logseq.DB.datascriptQuery(q);
  const results = (queried || []).flat().filter(present);
  const patterns = (matches || []).map(expandInput).map(function(pattern){
    return new RegExp(pattern);
  });
  return results.filter(match(patterns)).filter(present).map(function(block){
    return block.uuid.$uuid$;
  });
}

function updateIds(qu){
  const {classname} = qu;
  findIds(qu).then(function(uuids){
    classes[classname] = uuids;
    classify(classname, uuids);
  });
}

function classify(classname, uuids){
  const hits = uuids.map(function(uuid){
    return "div[blockid=\"@uuid\"]".replace(/\@uuid/g, uuid);
  }).join(", ");
  const prior = top.document.querySelectorAll(`.${classname}`);
  const els = Array.from(top.document.querySelectorAll(hits));
  for(let el of prior){
    if (!els.includes(el)) {
      el.classList.remove(classname);
    }
  }
  for(let el of els){
    el.classList.add(classname);
  }
}

async function refresh(){
  for(let classname in classes) {
    const uuids = classes[classname];
    classify(classname, uuids);
  }
}

function createModel(){
  return {refresh};
}

function update(queries){
  setTimeout(function(){
    for(let q of queries) {
      if (!q.disabled) {
        updateIds(q);
        (q.refreshRate || 0) > 0 && setInterval(updateIds.bind(q, q), q.refreshRate * 1000);
      }
    }
  }, 1000);
}

async function main(){
  update(logseq.settings.queries);
  setInterval(refresh, (logseq.settings.refreshRate || 5) * 1000);
  logseq.App.onRouteChanged(refresh);
}

logseq.ready(createModel(), main).catch(console.error.bind(console));
