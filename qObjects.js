import qlikapp from "./qlikapp";
import subjectList from "./subjectList";
import seasonList from "./seasonList";
import decadeList from "./decadeList";
import seasonCube from "./seasonCube";
import subjectCube from "./subjectCube";
import expressions from "./expressions";

export default new Promise((resolve, reject) => {
  qlikapp.then((app) => {
    return Promise.all([subjectList.init(), seasonList.init(), decadeList.init(), seasonCube.init(), subjectCube.init(), expressions.init()]);
  }).then(() => {
    resolve([subjectList, seasonList, decadeList, seasonCube, subjectCube, expressions]);
  });
});