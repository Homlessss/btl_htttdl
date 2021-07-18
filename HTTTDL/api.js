import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  post: 5432,
  user: "postgres",
  password: "admin",
  database: "BTL",
});

const SIRD = "4326";

var HandlerFunction = (functionname, Point) => {
  pool.connect();
  var Result = {};
  switch (functionname) {
    case "getInfoHN4":
      Result = GetInfoHN4(pool);
    case "getInfoHN6":
      Result = GetInfoHN6(pool, SIRD, Point);
    case "getInfoHN8":
      Result = GetInfoHN8(pool, SIRD, Point);
    case "getInfoHSHN":
      Result = GetInfoHSHN(pool, SIRD, Point);
    case "getInfoRHN":
      Result = GetInfoRHN(pool, SIRD, Point);
    case "getInfoSOS":
      Result = GetInfoSOS(pool, SIRD, Point);
    default:
      break;
  }
  pool.end();
  if (Result != null) return JSON.stringify(Result);
  else return null;
};

var GetInfoHN4 = (pool) => {
  return pool.query(
    "SELECT gid_1, name_1, type_1, name_0, area , ST_AsGeoJson(geom) as geo from hanoi4"
  );
};

var GetInfoHN6 = (pool, SIRD, Point) => {
  Point = Point.replace(" ", ",");
  return pool.query(
    `SELECT gid_2, , type_2, name_1, name_0, area , ST_AsGeoJson(geom) as geo from hanoi6 where ST_Within('SRID=${SIRD};POINT(${Point})'::geometry,geom)`
  );
};

var GetInfoHN8 = (pool, SIRD, Point) => {
  Point = Point.replace(" ", ",");
  return pool.query(
    `SELECT gid_3, name_3, type_3, name_2, name_1, name_0, area , ST_AsGeoJson(geom) as geo from hanoi8 where ST_Within('SRID=${SIRD};POINT(${Point}'::geometry,geom);`
  );
};

var GetInfoHSHN = (pool, Point) => {
  Point = Point.replace(" ", ",");
  var Distance = `ST_Distance('POINT(${Point})',ST_AsText(geom))`;
  var MinDistance = `SELECT min(ST_Distance('POINT(${Point}',ST_AsText(geom))) from hospitalhanoi`;
  return pool.query(
    `SELECT full_id, name, phone, website, email, url_img, addr_stree, ST_AsGeoJson(geom) as geo from hospitalhanoi where ${Distance} = ${MinDistance} and ${Distance} < 0.05`
  );
};

var GetInfoRHN = (pool, Point) => {
  Point = Point.replace(" ", ",");
  var Distance = `ST_Distance('POINT(${Point})',ST_AsText(geom))`;
  var MinDistance = `SELECT min(ST_Distance('POINT(${Point}',ST_AsText(geom))) from road_hanoi`;
  return pool.query(
    `SELECT gid, name, length, ST_AsGeoJson(geom) as geo from road_hanoi where ${Distance} = ${MinDistance} and ${Distance} < 0.05`
  );
};

var GetInfoSOS = (pool, Point) => {
  Point = Point.replace(" ", ",");
  var Distance = `ST_Distance('POINT(${Point})',ST_AsText(geom))`;
  return pool.query(
    `SELECT ST_AsGeoJson(geom) as geo from hospitalhanoi where ${Distance} < 0.05 ORDER BY ${Distance} ASC limit 5`
  );
};

export default HandlerFunction;