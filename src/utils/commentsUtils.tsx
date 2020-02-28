import React from 'react';
import { renderToString } from 'react-dom/server';

import { IAccount } from 'apollo/types/graphql-types';
import { getDisplayName } from './userUtils';

const REGEX_PATTERN = /@\[(.*?)\]\((.*?)\)/gm; // mention format @[__email__](__id__)

export const transformComment = (comment: string, mentions: IAccount[]) => {
  const replace_map: { [key: string]: string }  = {};
  mentions.forEach(({ id, ...others }) => {
    const derivedName = getDisplayName(others);
    if (derivedName) {
      replace_map[`@[${derivedName}](${id})`] = renderToString(
        <a href={`/profile/${id}`}>{derivedName}</a>
      );
    }
  });
  return comment.replace(REGEX_PATTERN, match => replace_map[match]);
};
