import qlikapp from "./qlikapp";
import subjectList from "./objects/subjectList";
import seasonList from "./objects/seasonList";
import decadeList from "./objects/decadeList";
import seasonCube from "./objects/seasonCube";
import subjectCube from "./objects/subjectCube";
import expressions from "./objects/expressions";
import typeList from "./objects/typeList";

export default new Promise((resolve, reject) => {
  qlikapp.then((app) => {
    return Promise.all([subjectList.init(), seasonList.init(), decadeList.init(), seasonCube.init(), subjectCube.init(), expressions.init(), typeList.init()]);
  }).then(() => {
    resolve([subjectList, seasonList, decadeList, seasonCube, subjectCube, expressions, typeList]);
  });
});