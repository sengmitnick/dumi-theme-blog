import React, { useContext, useState, useEffect } from "react";
import { context, NavLink } from "dumi/theme";

interface PostsProps {}

export interface IMenuItem {
  path?: string;
  title: string;
  meta?: Record<string, any>;
  children?: IMenuItem[];
}

interface MenuItem extends IMenuItem {
  createTime: number;
  meta: Record<string, any>;
}

export interface IRoute {
  component?: string;
  exact?: boolean;
  path?: string;
  wrappers?: string[];
  title?: string;
  __toMerge?: boolean;
  __isDynamic?: boolean;
  meta: Record<string, any>;
  [key: string]: any;
}

function tieMenu(menu: IMenuItem[], routes: IRoute[]): MenuItem[] {
  let route: IRoute, createTime: number, meta: Record<string, any>;
  return menu.reduce<MenuItem[]>((previousValue, currentValue) => {
    if (currentValue.children && currentValue.children.length > 0) {
      return [...previousValue, ...tieMenu(currentValue.children, routes)];
    }
    route = routes.find((route) => route.path === currentValue.path);
    if (route) {
      meta = route.meta;
      createTime = meta.date ? Date.parse(meta.date) / 1000 : meta.updatedTime;
    }
    previousValue.push({ ...currentValue, createTime, meta });
    return previousValue;
  }, []);
}

function formatMenu(menu: IMenuItem[], routes: IRoute[]) {
  let menus = tieMenu(menu, routes);
  // 这里没做任何判断第一篇文章是否是 index.md
  menus.splice(0, 1);

  return menus.sort((a, b) => b.createTime - a.createTime);
}

const Posts: React.FC<PostsProps> = () => {
  const { menu, routes } = useContext(context);
  const [menus, setMenus] = useState(formatMenu(menu, routes));

  useEffect(() => {
    setMenus(formatMenu(menu, routes));
  }, [menu, routes]);

  return (
    <div className="__dumi-default-posts">
      <ul className="__dumi-default-posts-list">
        {menus.map((item) => {
          return (
            <li key={item.path || item.title}>
              <NavLink to={item.path} exact>
                <span>{item.title}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Posts;
