import cx from "classnames";
import * as React from "react";

import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function SectionSlogan({ className, style }: Props) {
  return (
    <div className={cx(styles.container, className)} style={style}>
      #SIMPLYGROW.
    </div>
  );
}
