import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

const FeatureList = [
  {
    title: "现代化开发工具",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: <>学习并使用最新的前端开发工具和技术栈，如Webpack、Babel、ESLint等，让你的开发流程更加高效。</>,
  },
  {
    title: "深入React",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: <>掌握React框架，从基础的组件构建到高级的状态管理和性能优化，让你的前端开发如虎添翼。</>,
  },
  {
    title: "前端安全",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: <>掌握前端安全知识，防范XSS、CSRF等常见攻击，保护用户数据安全。</>,
  },
]

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
