import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { DraggablePanel, Highlight } from '@ant-design/pro-editor';
// import { transformSync } from '@babel/core';
import { useTheme } from 'antd-style';
import type { FC } from 'react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';
import { useStore } from '../../store';
import { useStyles } from './style';

const HEADER_HEIGHT = 36;

interface CodePanelProps {
  onCopy?: (children: any) => void;
}

/**
 * 用于组装成品代码并高亮展示
 */
export const CodePanel: FC<CodePanelProps> = memo((props) => {
  const [config, componentAsset] = useStore((s) => [s.config, s.componentAsset], shallow);
  const { styles, cx } = useStyles();
  const [expand, setExpand] = useState(true);
  const [height, setHeight] = useState(220);
  const { onCopy } = props;
  const { isDarkMode } = useTheme();

  const configCode = componentAsset.generateCode(config);

  let prettierCode = '';
  try {
    const prettier = require('prettier');
    const plugins = [require('prettier/parser-typescript')];

    prettierCode = prettier.format(configCode, {
      parser: 'typescript',
      plugins,
      // 以下参考 Bigfish 配置
      semi: true,
      singleQuote: true,
      printWidth: 100,
      trailingComma: 'all',
      proseWrap: 'never',
      endOfLine: 'lf',
    });
  } catch (err) {
    console.error('err', err);
    prettierCode = `代码格式化失败，格式化前为:\n ${configCode}`;
  }

  return (
    <DraggablePanel
      onSizeChange={(delta) => {
        setHeight(height + delta.height);
      }}
      placement={'bottom'}
      size={{ height: expand ? height : HEADER_HEIGHT }}
      minHeight={HEADER_HEIGHT}
      className={styles.container}
      expandable={false}
    >
      <Flexbox
        padding={'6px 8px'}
        horizontal
        distribution={'space-between'}
        align={'center'}
        className={cx(styles.header, !expand ? styles.collapse : '')}
        onClick={() => setExpand(!expand)}
      >
        <Flexbox horizontal gap={12} className={styles.headerTitle}>
          {expand ? <DownOutlined /> : <RightOutlined />}
          代码生成
        </Flexbox>

        <Flexbox
          horizontal
          gap={8}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* 右侧按钮区域 */}
        </Flexbox>
      </Flexbox>
      <Flexbox className={styles.code}>
        <Highlight
          theme={isDarkMode ? 'dark' : 'light'}
          lineNumber
          language="tsx"
          style={{ height: '100%' }}
          onCopy={onCopy}
        >
          {prettierCode}
        </Highlight>
      </Flexbox>
    </DraggablePanel>
  );
});

export default CodePanel;
